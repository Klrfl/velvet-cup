import { db } from "@/database"
import type { APIRoute } from "astro"
import { z } from "astro:content"

export const PUT: APIRoute = async ({ request, params }) => {
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

	const body = await request.json()

	const schema = z.object({
		variant_id: z.number(),
		quantity: z.number(),
	})

	const { data, error } = schema.safeParse(body)

	if (!data || error) {
		return new Response(
			JSON.stringify({
				message: "body malformed",
			}),
			{ status: 400 }
		)
	}

	const result = await db
		.updateTable("baskets")
		.set(data)
		.where("id", "=", basket_id)
		.returningAll()
		.executeTakeFirst()

	if (!result) {
		return new Response(
			JSON.stringify({
				message: "an error occured when updating basket item.",
			}),
			{ status: 500 }
		)
	}

	return new Response(
		JSON.stringify({
			message: "successfully updated basket item",
			data: body,
		})
	)
}

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
