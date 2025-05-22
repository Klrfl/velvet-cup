import { TransactionError } from "@/lib/errors"
import OrderServiceImpl from "@/lib/services/order"
import type { APIRoute } from "astro"
import { z } from "astro:content"

export const GET: APIRoute = async ({ params }) => {
	const { data: order_id, error } = z
		.string()
		.uuid()
		.safeParse(params["order_id"])
	if (!order_id || error) {
		return new Response(
			JSON.stringify({
				message: "invalid order id",
			}),
			{ status: 400 }
		)
	}

	const service = new OrderServiceImpl()
	try {
		const result = await service.repayOrder(order_id)
		return new Response(
			JSON.stringify({
				message: "successfully got repay token",
				data: result,
			})
		)
	} catch (err) {
		console.error(err)

		if (err instanceof TransactionError) {
			switch (err.code) {
				case "ORDER_NOT_FOUND":
					return new Response(
						JSON.stringify({
							message: "invalid order id",
						}),
						{ status: 400 }
					)
			}
		}

		return new Response(
			JSON.stringify({
				message: "there was an unknown error when repaying",
			}),
			{ status: 500 }
		)
	}
}
