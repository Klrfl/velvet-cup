import { db } from "@/database"
import type { APIRoute } from "astro"
import { z } from "astro:content"

export const GET: APIRoute = async ({ request, redirect }) => {
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

	const existingOrder = await db
		.selectFrom("orders")
		.select(["id", "status_id"])
		.where("orders.id", "=", searchParams.order_id)
		.executeTakeFirst()

	if (!existingOrder) {
		return new Response(JSON.stringify({ message: "order not found" }), {
			status: 404,
		})
	}

	if (existingOrder.status_id === 2) {
		return redirect("/")
	}

	const targetOrder = await db
		.updateTable("orders")
		.set({ status_id: 2 })
		.where("id", "=", existingOrder.id)
		.returningAll()
		.executeTakeFirst()

	if (!targetOrder) {
		return new Response(
			JSON.stringify({ message: "error when updating order status" }),
			{ status: 404 }
		)
	}

	const deleteResult = await db
		.deleteFrom("baskets")
		.where("user_id", "=", session.user.id)
		.execute()

	return new Response(
		JSON.stringify({
			message: "successfully updated order status",
			data: targetOrder,
		})
	)
}
