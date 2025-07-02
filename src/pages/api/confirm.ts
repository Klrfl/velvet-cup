import { TransactionError } from "@/lib/errors"
import OrderServiceImpl from "@/lib/services/order"
import type { APIRoute } from "astro"
import { z } from "astro:content"

export const GET: APIRoute = async ({ request, redirect, locals }) => {
	const session = locals.session
	if (!session) return redirect("/login")

	const rawSearchParams = new URL(request.url).searchParams

	const schema = z.object({
		order_id: z.string().uuid(),
		status_code: z.coerce.number(),
		transaction_status: z.string(),
	})

	const { data: searchParams, error } = schema.safeParse(
		Object.fromEntries(rawSearchParams.entries())
	)

	if (error || !searchParams) {
		console.error(error)

		return new Response(JSON.stringify({ message: "invalid order" }), {
			status: 400,
		})
	}

	const service = new OrderServiceImpl()

	try {
		const orderId = await service.confirmOrder(
			session.user.id,
			searchParams.order_id
		)

		/**
		 * TODO: redirect to a web apge instead of responding with JSON
		 * */
		return new Response(
			JSON.stringify({
				message: "successfully updated order status",
				data: orderId,
			})
		)
	} catch (err) {
		console.error(err)

		if (err instanceof TransactionError) {
			switch (err.code) {
				case "ORDER_NOT_FOUND":
					// TODO: do something better other than returning a JSON obj
					return new Response(JSON.stringify({ message: "invalid order id" }), {
						status: 400,
					})
				case "ORDER_STATUS_UPDATE_FAILURE":
					return new Response(
						JSON.stringify({ message: "failed to mark status as completed" }),
						{ status: 500 }
					)
				case "ORDER_ALREADY_CONFIRMED":
					return redirect(`/account/orders`)
			}
		}

		// TODO: redirect to an error page or something
		return new Response(
			JSON.stringify({
				message: "there was an error while confirming your order.",
			}),
			{ status: 500 }
		)
	}
}
