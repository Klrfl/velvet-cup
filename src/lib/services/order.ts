import { db } from "@/database"
import { jsonArrayFrom } from "kysely/helpers/postgres"
import { z } from "astro:content"
import client from "@klrfl/midtrans-client"

import type { Order, AdminOrder, OrderUser } from "@/types"
import { TransactionError } from "@/lib/errors"

type MidtransToken = {
	token: string
	redirect_url: string
}

interface OrderService {
	getOrders(user_id: OrderUser["id"]): Promise<Order[]>
	getAdminOrders(): Promise<AdminOrder[]>
	checkout(user: OrderUser): Promise<MidtransToken>
	cancelOrder(order_id: Order["id"]): Promise<Order["id"]>
	confirmOrder(
		user_id: OrderUser["id"],
		order_id: Order["id"]
	): Promise<Order["id"]>
	repayOrder(order_id: Order["id"]): Promise<MidtransToken>
}

const ordersQuery = db
	.selectFrom("orders")
	.leftJoin("order_status as os", "os.id", "orders.status_id")
	.select((eb) => [
		"orders.id",
		"orders.user_id",
		"orders.status_id",
		"orders.created_at",
		"orders.token",
		"os.name as status",
		jsonArrayFrom(
			eb
				.selectFrom("order_detail as od")
				.leftJoin("menu as m", "m.id", "od.menu_id")
				.select([
					"od.id",
					"od.order_id",
					"od.menu_id",
					"m.name as menu_name",
					"od.quantity",
					"od.price",
					"od.notes",
					"od.variant_id",
				])
				.whereRef("od.order_id", "=", "orders.id")
		).as("details"),
	])

export default class OrderServiceImpl implements OrderService {
	async getOrders(user_id: OrderUser["id"]): Promise<Order[]> {
		const result = await ordersQuery
			.where("user_id", "=", user_id)
			.orderBy("created_at desc")
			.execute()

		// result.status returns a string... should have used an enum
		// but thinking back my decision is already correct, we'll just
		// validate it in runtime
		// it is not the end of the world even if it's not `"pending" | "completed"`
		return result as Order[]
	}

	async getAdminOrders(): Promise<AdminOrder[]> {
		const result = await ordersQuery
			.leftJoin("user as u", "u.id", "orders.user_id")
			.select("u.name as user_name")
			.orderBy("created_at desc")
			.execute()

		return result as AdminOrder[]
	}

	async checkout(user: OrderUser): Promise<MidtransToken> {
		const snap = new client.Snap({
			isProduction: import.meta.env.PROD,
			serverKey: import.meta.env.MIDTRANS_SERVER_KEY!,
		})

		const rawBasket = await db
			.selectFrom("baskets")
			.leftJoin("menu as m", "m.id", "baskets.menu_id")
			.leftJoin("menu_variants as mv", "mv.id", "baskets.variant_id")
			.select([
				"m.id as menu_id",
				"baskets.variant_id",
				"m.name", // for midtrans dashboard
				"mv.name as variant_name", // for midtrans dashboard
				"mv.price",
				"baskets.quantity",
			])
			.where("baskets.user_id", "=", user.id)
			.execute()

		const { data: basket, error } = z
			.array(
				z.object({
					menu_id: z.number(),
					name: z.string(),
					variant_id: z.number(),
					variant_name: z.string(),
					price: z.coerce.number(),
					quantity: z.number(),
					notes: z.string().optional().nullable(),
				})
			)
			.safeParse(rawBasket)

		if (!basket || !basket.length || error || !rawBasket) {
			console.log(rawBasket)
			console.error(error)

			throw new Error("basket is empty or doesn't exist")
		}

		const orderResult = await db.transaction().execute(async (tx) => {
			const order = await tx
				.insertInto("orders")
				.values({ user_id: user.id, status_id: 1 })
				.returningAll()
				.executeTakeFirst()

			if (!order) throw new Error("no order found")

			const orderDetails = basket.map((item) => {
				const { name, variant_name, ...rest } = item
				return rest
			})

			const detailsResult = await tx
				.insertInto("order_detail")
				.values(
					orderDetails.map((item) => {
						return {
							...item,
							order_id: order.id,
						}
					})
				)
				.returningAll()
				.execute()

			return {
				order,
				details: detailsResult,
			}
		})

		const total = basket.reduce(
			(acc, item) => Number(item.price) * item.quantity + acc,
			0
		)

		const params = {
			transaction_details: {
				order_id: orderResult.order.id,
				gross_amount: total,
			},
			item_details: basket,
			customer_details: {
				name: user.name,
				email: user.email,
			},
		}

		try {
			const response = await snap.createTransaction(params)
			const responseSchema = z
				.object({
					token: z.string(),
					redirect_url: z.string().url(),
				})
				.required()
			const { data, error } = responseSchema.safeParse(response)

			if (error) {
				console.error(data)
				throw new Error("response is unexpected")
			}

			/**
			 * The payment popup on the frontend is closable, and
			 * the customer can resume payment via /account/orders page
			 * insert Midtrans token to database to retry payment
			 * */
			await db
				.updateTable("orders")
				.set("token", data.token)
				.where("id", "=", orderResult.order.id)
				.execute()

			return data
		} catch (error) {
			throw new Error("error when creating transaction token")
		}
	}

	async cancelOrder(order_id: Order["id"]): Promise<Order["id"]> {
		const existingOrder = await db
			.selectFrom("orders")
			.selectAll()
			.where("id", "=", order_id)
			.executeTakeFirst()
		if (!existingOrder) {
			throw new TransactionError("order not found", "ORDER_NOT_FOUND")
		}

		// 5 is code for status cancelled
		// see migration file
		const updateResult = await db
			.updateTable("orders")
			.set("status_id", 5)
			.where("orders.id", "=", order_id)
			.returning("id")
			.executeTakeFirst()

		if (!updateResult) {
			throw new TransactionError(
				"failed to cancel order",
				"ORDER_CANCELLATION_FAILURE"
			)
		}

		return updateResult.id
	}

	async confirmOrder(
		user_id: OrderUser["id"],
		order_id: Order["id"]
	): Promise<Order["id"]> {
		const existingOrder = await db
			.selectFrom("orders")
			.select(["id", "status_id"])
			.where("orders.id", "=", order_id)
			.executeTakeFirst()

		if (!existingOrder) {
			throw new TransactionError("order not found", "ORDER_NOT_FOUND")
		}

		if (existingOrder.status_id === 2) {
			throw new TransactionError(
				"Order already confirmed",
				"ORDER_ALREADY_CONFIRMED"
			)
		}

		const targetOrder = await db
			.updateTable("orders")
			.set({ status_id: 2 })
			.where("id", "=", existingOrder.id)
			.returningAll()
			.executeTakeFirst()

		if (!targetOrder) {
			throw new TransactionError(
				"error when updating order status",
				"ORDER_STATUS_UPDATE_FAILURE"
			)
		}

		/**
		 * clear basket after ordering
		 * TODO: move into transaction to guarantee atomicity
		 * */
		const deleteResult = await db
			.deleteFrom("baskets")
			.where("user_id", "=", user_id)
			.execute()

		return targetOrder.id
	}

	/**
	 * returns the midtrans API token for the existing order.
	 * */
	async repayOrder(order_id: Order["id"]): Promise<MidtransToken> {
		const existingOrder = await db
			.selectFrom("orders")
			.selectAll()
			.where("id", "=", order_id)
			.executeTakeFirst()

		if (!existingOrder || existingOrder.token === "") {
			throw new TransactionError("order not found", "ORDER_NOT_FOUND")
		}

		return { token: existingOrder.token, redirect_url: "" }
	}
}
