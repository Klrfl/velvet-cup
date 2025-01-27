import { db } from "@/database"
import type { APIRoute } from "astro"

export const POST: APIRoute = async ({ request }) => {
	const formData = await request.formData()

	const name = formData.get("menu_name") as string
	const description = formData.get("menu_description") as string

	const newMenu = { name, description }
	//TODO: add validation

	const results = await db.insertInto("menu").values(newMenu).execute()

	for (const result of results) {
		if (Number(result.numInsertedOrUpdatedRows) === 0)
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
			data: newMenu,
		})
	)
}
