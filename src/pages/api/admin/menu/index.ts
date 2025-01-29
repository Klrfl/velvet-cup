import { db } from "@/database"
import type { APIRoute } from "astro"
import { z } from "astro:content"

export const POST: APIRoute = async ({ request }) => {
	const formData = await request.formData()

	const name = formData.get("menu_name")
	const description = formData.get("menu_description")
	const category_id = formData.get("menu_category")

	const inputSchema = z.object({
		name: z.string(),
		description: z.string(),
		category_id: z.number(),
	})

	let inputMenu
	try {
		inputMenu = inputSchema.parse({
			name,
			description,
			category_id: Number(category_id),
		})
	} catch (error) {
		console.error(error)

		return new Response(
			JSON.stringify({ message: "body malformed", error, body: inputMenu }),
			{ status: 400 }
		)
	}

	const menu = await db
		.insertInto("menu")
		.values(inputMenu)
		.returningAll()
		.executeTakeFirst()

	if (!menu) {
		return new Response(
			JSON.stringify({
				message: "there was an error adding a new menu.",
			}),
			{ status: 500 }
		)
	}

	return new Response(
		JSON.stringify({
			message: "added a new menu successfully.",
			data: menu,
		})
	)
}
