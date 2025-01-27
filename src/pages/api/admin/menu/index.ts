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

export const PUT: APIRoute = async ({ request, params }) => {
	const formData = await request.formData()

	const id = params.id

	if (!id || isNaN(Number(id))) {
		return new Response(
			JSON.stringify({
				message: "invalid menu id.",
			}),
			{ status: 401 }
		)
	}

	const name = formData.get("menu_name") as string
	const description = formData.get("menu_description") as string

	// TODO: add validation

	const newMenu = { name, description }
	const results = await db
		.updateTable("menu")
		.set(newMenu)
		.where("id", "=", Number(id))
		.returning("id")
		.execute()

	for (const result of results) {
		console.log(result)

		if (!result.id) {
			return new Response(
				JSON.stringify({
					message: `failed to update menu with id ${id}`,
				}),
				{ status: 500 }
			)
		}
	}

	return new Response(
		JSON.stringify({
			message: `successfully edited menu with id ${id}`,
			data: newMenu,
		})
	)
}
