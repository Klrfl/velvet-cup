import CategoryServiceImpl from "@/lib/services/category"
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

	const categoryService = new CategoryServiceImpl()

	try {
		const result = await categoryService.editCategory({ id, name })

		return new Response(
			JSON.stringify({
				message: "successfully updated menu category",
				data: result,
			})
		)
	} catch (error) {
		console.error(error)

		return new Response(
			JSON.stringify({
				message: "something went wrong when updating menu category",
			}),
			{ status: 500 }
		)
	}
}

export const DELETE: APIRoute = async ({ params }) => {
	const { id: rawId } = params
	const { data: id, error } = z.coerce.number().safeParse(rawId)
	if (!id || error) {
		return new Response(
			JSON.stringify({
				message: "invalid id",
			}),
			{ status: 400 }
		)
	}

	const categoryService = new CategoryServiceImpl()

	try {
		const result = await categoryService.deleteCategory(id)

		return new Response(
			JSON.stringify({
				message: "successfully deleted menu category",
				data: { id: result },
			}),
			{ status: 201 }
		)
	} catch (error) {
		console.error(error)

		return new Response(
			JSON.stringify({
				message: "something went wrong when deleted menu category",
			}),
			{ status: 500 }
		)
	}
}
