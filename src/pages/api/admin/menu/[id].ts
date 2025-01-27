import { db } from "@/database"
import type { APIRoute } from "astro"

export const PUT: APIRoute = async ({ request, params }) => {
	const formData = await request.formData()

	const { id } = params

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

export const DELETE: APIRoute = async ({ params }) => {
	const { id } = params

	const menuId = Number(id)

	if (!id || isNaN(menuId)) {
		return new Response(
			JSON.stringify({
				mesage: "invalid id",
			}),
			{ status: 400 }
		)
	}

	const results = await db.deleteFrom("menu").where("id", "=", menuId).execute()

	for (const result of results) {
		if (Number(result.numDeletedRows) === 0) {
			return new Response(
				JSON.stringify({
					message: "nothing was deleted",
				}),
				{ status: 500 }
			)
		}
	}

	return new Response(
		JSON.stringify({
			message: "successfully deleted menu.",
		})
	)
}
