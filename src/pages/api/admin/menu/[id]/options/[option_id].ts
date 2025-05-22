import MenuOptionServiceImpl from "@/lib/services/menu-option"
import type { APIRoute } from "astro"
import { z } from "astro:content"

export const PUT: APIRoute = async ({ request, params }) => {
	const { id: raw_menu_id, option_id: raw_option_id } = params
	const option_id = Number(raw_option_id)
	const menu_id = Number(raw_menu_id)

	if (isNaN(menu_id)) {
		return new Response(JSON.stringify({ message: "invalid menu id" }), {
			status: 400,
		})
	}

	if (isNaN(option_id)) {
		return new Response(JSON.stringify({ message: "invalid option id" }), {
			status: 400,
		})
	}

	const body = await request.json()

	const variantSchema = z
		.object({
			name: z.string(),
		})
		.required()

	const { data: newOption, error } = variantSchema.safeParse(body)
	if (!newOption || error) {
		console.error(error)

		return new Response(
			JSON.stringify({
				message: "body malformed",
				body,
			}),
			{ status: 400 }
		)
	}

	const service = new MenuOptionServiceImpl()
	try {
		const result = service.editMenuOption(option_id, newOption)

		return new Response(
			JSON.stringify({
				message: "successfully updated menu option.",
				data: result,
			})
		)
	} catch (err) {
		console.error(err)

		return new Response(
			JSON.stringify({
				message: "error when updating option",
			}),
			{ status: 500 }
		)
	}
}
