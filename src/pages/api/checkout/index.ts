import type { APIRoute } from "astro"
import OrderServiceImpl from "@/lib/services/order"

export const POST: APIRoute = async ({ locals, redirect }) => {
	const session = locals.session

	if (!session) return redirect("/login")

	const orderService = new OrderServiceImpl()

	try {
		const token = await orderService.checkout({
			email: session.user.email,
			name: session.user.name,
			id: session.user.id,
		})

		return new Response(
			JSON.stringify({
				data: token,
			})
		)
	} catch (err) {
		console.error(err)

		return new Response(
			JSON.stringify({ message: "something went wrong when placing order" }),
			{ status: 500 }
		)
	}
}
