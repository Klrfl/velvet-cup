import { db } from "@/database"
import type { APIRoute } from "astro"

export const POST: APIRoute = async ({ request }) => {
	const { name } = await request.json()

	//TODO: validate body
	if (!name) {
		return new Response(JSON.stringify({ message: "body malformed" }), {
			status: 400,
		})
	}

	const result = await db
		.insertInto("menu_categories")
		.values({ name })
		.returningAll()
		.executeTakeFirst()

	if (!result) {
		return new Response(
			JSON.stringify({
				message: "failed to insert new menu category.",
			}),
			{ status: 500 }
		)
	}

	return new Response(
		JSON.stringify({
			message: "successfully added new category",
			data: result,
		})
	)
}
