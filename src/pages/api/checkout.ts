import { db } from "@/database"
import { auth } from "@/lib/auth"
import type { APIRoute } from "astro"
import { z } from "astro:content"
import client from "@klrfl/midtrans-client"

export const POST: APIRoute = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers,
	})

	if (!session) {
		return new Response(
			JSON.stringify({
				message: "unauthorized",
			}),
			{ status: 401 }
		)
	}

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
		.where("baskets.user_id", "=", session.user.id)
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

		return new Response(
			JSON.stringify({
				message: "error when parsing order.",
			}),
			{ status: 500 }
		)
	}

	const orderResult = await db.transaction().execute(async (tx) => {
		const order = await tx
			.insertInto("orders")
			.values({ user_id: session.user.id, status_id: 1 })
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

	const snap = new client.Snap({
		isProduction: import.meta.env.PROD,
		serverKey: import.meta.env.MIDTRANS_SERVER_KEY!,
	})

	const params = {
		transaction_details: {
			order_id: orderResult.order.id,
			gross_amount: total,
		},
		item_details: basket,
		customer_details: {
			name: session.user.name,
			email: session.user.email,
		},
	}

	let data
	try {
		const response = await snap.createTransaction(params)
		data = response
	} catch (error) {
		console.error((error as any).ApiResponse)
		return new Response(JSON.stringify((error as any).ApiResponse as unknown), {
			status: 400,
		})
	}

	return new Response(
		JSON.stringify({
			data,
		})
	)
}
