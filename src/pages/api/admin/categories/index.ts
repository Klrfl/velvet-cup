import { db } from "@/database"
import type { APIRoute } from "astro"
import { z } from "astro:content"

export const POST: APIRoute = async ({ request }) => {
	const { name: inputName } = await request.json()
	const { data: name, error } = z.coerce
		.string()
		.nonempty()
		.safeParse(inputName)

	if (!error || !name) {
		console.error(error)

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
