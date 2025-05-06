import { db } from "@/database"
import type { APIRoute } from "astro"
import { z } from "astro:schema"

export const PUT: APIRoute = async ({ request, params }) => {
	const { id: inputId } = params
	const { data: id, error } = z.coerce.number().safeParse(inputId)

	if (error) {
		console.error(error)

		return new Response(
			JSON.stringify({
				message: "invalid id",
			}),
			{ status: 400 }
		)
	}

	const { name: inputName } = await request.json()
	const { data: name, error: payloadError } = z
		.string()
		.nonempty()
		.safeParse(inputName)

	if (payloadError) {
		console.error(payloadError)

		return new Response(
			JSON.stringify({
				message: "body malformed",
			}),
			{ status: 400 }
		)
	}

	const result = await db
		.updateTable("menu_categories")
		.set("name", name)
		.where("id", "=", id)
		.returning(["name", "id"])
		.executeTakeFirst()

	if (!result) {
		return new Response(
			JSON.stringify({
				message: "something went wrong when updating menu category",
			}),
			{ status: 500 }
		)
	}

	return new Response(
		JSON.stringify({
			message: "successfully updated menu category",
			data: result,
		})
	)
}

export const DELETE: APIRoute = async ({ params }) => {
	const { id: inputId } = params
	const { data: id, error } = z.coerce.number().safeParse(inputId)
	if (error) {
		return new Response(
			JSON.stringify({
				message: "invalid id",
			}),
			{ status: 400 }
		)
	}

	const result = await db
		.deleteFrom("menu_categories")
		.where("id", "=", id)
		.returning("id")
		.executeTakeFirst()

	if (!result) {
		return new Response(
			JSON.stringify({
				message: "something went wrong when deleted menu category",
			}),
			{ status: 500 }
		)
	}

	return new Response(
		JSON.stringify({
			message: "successfully deleted menu category",
			data: { id },
		}),
		{ status: 201 }
	)
}
