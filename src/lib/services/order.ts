import { db } from "@/database"
import { jsonArrayFrom } from "kysely/helpers/postgres"
import type { User } from "@/database/database.types"
import type { Order, AdminOrder } from "@/types"
import type { Selectable } from "kysely"

interface OrderService {
	getOrders(user_id: Selectable<User>["id"]): Promise<Order[]>
	getAdminOrders(): Promise<AdminOrder[]>
	placeOrder(user_id: Selectable<User>["id"], order: Order): Promise<Order>
	cancelOrder(order_id: Order["id"]): Promise<Order>
	checkoutOrder(order_id: Order["id"]): Promise<Order>
}

const ordersQuery = db
	.selectFrom("orders")
	.leftJoin("order_status as os", "os.id", "orders.status_id")
	.select((eb) => [
		"orders.id",
		"orders.user_id",
		"orders.status_id",
		"orders.created_at",
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

export class OrderServiceImpl implements OrderService {
	async getOrders(user_id: Selectable<User>["id"]): Promise<Order[]> {
		const result = await ordersQuery
			.where("user_id", "=", user_id)
			.orderBy("created_at desc")
			.execute()

		return result
	}

	async getAdminOrders(): Promise<AdminOrder[]> {
		const result = await ordersQuery
			.leftJoin("user as u", "u.id", "orders.user_id")
			.select("u.name as user_name")
			.orderBy("created_at desc")
			.execute()

		return result as AdminOrder[]
	}
	placeOrder(user_id: Selectable<User>["id"], order: Order): Promise<Order> {
		throw new Error("Method not implemented.")
	}
	cancelOrder(order_id: Order["id"]): Promise<Order> {
		throw new Error("Method not implemented.")
	}
	checkoutOrder(order_id: Order["id"]): Promise<Order> {
		throw new Error("Method not implemented.")
	}
}
