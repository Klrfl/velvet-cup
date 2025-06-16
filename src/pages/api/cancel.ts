import { TransactionError } from "@/lib/errors"
import OrderServiceImpl from "@/lib/services/order"
import type { APIRoute } from "astro"
import { z } from "astro:schema"

export const GET: APIRoute = async ({ redirect, request }) => {
	const { searchParams } = new URL(request.url)
	const rawOrderId = searchParams.get("id")
	const { data: orderId, error } = z.string().uuid().safeParse(rawOrderId)

	if (!orderId || error) {
		console.error(error)
		return new Response(
			JSON.stringify({
				message: "invalid order id",
			})
		)
	}

	const orderService = new OrderServiceImpl()
	try {
		await orderService.cancelOrder(orderId)
		return redirect("/account/orders")
	} catch (error) {
		console.error(error)

		if (error instanceof TransactionError) {
			switch (error.code) {
				case "ORDER_CANCELLATION_FAILURE":
					return new Response(
						JSON.stringify({
							message: "error when cancelling order",
						})
					)
				case "ORDER_NOT_FOUND":
					return new Response(
						JSON.stringify({
							message: "order not found",
						})
					)
			}
		}

		return new Response(
			JSON.stringify({
				message: "unknown error when cancelling order",
			})
		)
	}
}
