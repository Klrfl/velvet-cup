import { db } from "@/database"
import type { APIRoute } from "astro"

export const POST: APIRoute = async ({ request }) => {
	const formData = await request.formData()

	const name = formData.get("menu_name") as string
	const description = formData.get("menu_description") as string

	const inputMenu = { name, description }
	//TODO: add validation

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
			data: inputMenu,
		})
	)
}
