import { db } from "@/database"
import type { APIRoute } from "astro"

export const DELETE: APIRoute = async ({ params }) => {
	const { id } = params

	const basket_id = Number(id)
	if (isNaN(basket_id)) {
		return new Response(
			JSON.stringify({
				message: "invalid basket id",
			}),
			{ status: 400 }
		)
	}

	const deletedId = await db
		.deleteFrom("baskets")
		.where("id", "=", basket_id)
		.returning("id")
		.executeTakeFirst()

	if (!deletedId) {
		return new Response(
			JSON.stringify({
				message: "there was an error deleting basket item.",
			}),
			{ status: 500 }
		)
	}

	return new Response(
		JSON.stringify({
			message: "successfully deleted basket item.",
			data: deletedId,
		})
	)
}
