import MenuOptionServiceImpl from "@/lib/services/menu-option"
import type { APIRoute } from "astro"
import { z } from "astro:content"

export const POST: APIRoute = async ({ request, params }) => {
	const { id } = params
	const menu_id = Number(id)

	if (isNaN(menu_id)) {
		return new Response(JSON.stringify({ message: "invalid menu id" }), {
			status: 400,
		})
	}

	const body = await request.json()

	const variantOptionSchema = z
		.object({
			name: z.string(),
			values: z.array(z.object({ name: z.string() })),
		})
		.required()

	const { data: newMenuOption, error } = variantOptionSchema.safeParse(body)
	if (!newMenuOption || error) {
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
		const menuOptionValues = await service.addMenuOption(menu_id, newMenuOption)

		return new Response(
			JSON.stringify({
				message: "successfully added new menu variant option.",
				data: menuOptionValues,
			})
		)
	} catch (err) {
		console.error(err)

		return new Response(
			JSON.stringify({
				status: "error",
				message: "error when adding new menu option",
			}),
			{ status: 500 }
		)
	}
}
