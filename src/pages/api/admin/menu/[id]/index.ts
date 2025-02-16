import { db } from "@/database"
import type { APIRoute } from "astro"
import { z } from "astro:content"
import { sql } from "kysely"

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

	const name = formData.get("menu_name")
	const description = formData.get("menu_description")
	const category_id = formData.get("menu_category")
	const image = formData.get("menu_image")

	// TODO: add validation
	const schema = z.object({
		name: z.string(),
		description: z.string(),
		category_id: z.coerce.number().positive(),
		image: z.instanceof(File),
	})

	let newMenu
	try {
		newMenu = schema.parse({
			name,
			description,
			category_id,
			image,
		})
	} catch (error) {
		console.error(error)

		return new Response(
			JSON.stringify({
				message: "body malformed",
				data: newMenu,
			}),
			{ status: 400 }
		)
	}

	// no image submitted by admin
	if (newMenu.image.size === 0) {
		const { image, ...newMenuClone } = newMenu
		newMenu = newMenuClone
	} else {
		const imageBuf = await newMenu.image.arrayBuffer()
		let encodedImage = Buffer.from(imageBuf).toString("base64")
		encodedImage = `data:${request.headers.get("content-type")};charset=utf8;base64,${encodedImage}`
		newMenu = { ...newMenu, image: encodedImage }
	}

	const results = await db
		.updateTable("menu")
		.set({ ...newMenu, updated_at: new Date().toISOString() })
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

	const results = await db
		.updateTable("menu")
		.set("deleted_at", sql`now()`)
		.where("id", "=", menuId)
		.execute()

	for (const result of results) {
		if (Number(result.numUpdatedRows) === 0) {
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
