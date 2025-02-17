import { db } from "@/database"
import { auth } from "@/lib/auth"
import type { APIRoute } from "astro"
import client from "midtrans-client"
import { randomUUID } from "node:crypto"

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

	const order = await db
		.selectFrom("baskets")
		.leftJoin("menu as m", "m.id", "baskets.menu_id")
		.leftJoin("menu_variants as mv", "mv.id", "baskets.variant_id")
		.select([
			"baskets.id",
			"baskets.quantity",
			"m.name",
			"mv.name as variant_name",
			"mv.price",
		])
		.where("baskets.user_id", "=", session.user.id)
		.execute()

	if (!order.length) {
		return new Response(
			JSON.stringify({
				message: "basket is empty.",
			}),
			{ status: 404 }
		)
	}

	const total = order.reduce(
		(acc, item) => Number(item.price) * item.quantity + acc,
		0
	)

	const snap = new client.Snap({
		isProduction: import.meta.env.PROD,
		serverKey: import.meta.env.MIDTRANS_SERVER_KEY,
	})

	const params = {
		transaction_details: {
			order_id: randomUUID(),
			gross_amount: total,
		},
		item_details: order,
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
		return new Response(JSON.stringify((error as any).ApiResponse as unknown))
	}

	return new Response(
		JSON.stringify({
			data,
		})
	)
}
