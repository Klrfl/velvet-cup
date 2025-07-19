import KyselyMenuServiceFactory from "@/lib/factories/menu.factory"
import type { APIRoute } from "astro"
import { z } from "astro:content"

export const PUT: APIRoute = async ({ request, params }) => {
	const { id: rawId } = params
	const { data: menuId, error: idError } = z.coerce
		.number()
		.positive()
		.safeParse(rawId)

	if (idError || !menuId) {
		console.error(idError)

		return new Response(
			JSON.stringify({
				message: "invalid menu id.",
			}),
			{
				status: 401,
				headers: {
					"Content-Type": "application/json",
				},
			}
		)
	}

	const body = await request.json()

	const schema = z.object({
		name: z.string(),
		description: z.string(),
		category_id: z.coerce.number().positive(),
		image: z.string().optional().nullable().default(null),
	})

	let { data: newMenu, error } = schema.safeParse(body)

	if (!newMenu || error) {
		console.log(newMenu)
		console.error(error)

		return new Response(
			JSON.stringify({
				message: "body malformed",
				data: newMenu,
			}),
			{ status: 400 }
		)
	}

	const menuService = new KyselyMenuServiceFactory().createService()

	try {
		const menu = await menuService.editMenu(Number(id), newMenu)
		return new Response(
			JSON.stringify({
				message: `successfully edited menu with id ${id}`,
				data: menu,
			})
		)
	} catch (error) {
		return new Response(
			JSON.stringify({
				message: `failed to update menu with id ${id}`,
			}),
			{ status: 500 }
		)
	}
}

export const DELETE: APIRoute = async ({ params }) => {
	const { id: rawId } = params
	const { data: menuId, error } = z.coerce.number().positive().safeParse(rawId)

	if (error || !menuId) {
		console.error(error)
		return new Response(JSON.stringify({ message: "invalid id" }), {
			status: 400,
		})
	}

	const menuService = new KyselyMenuServiceFactory().createService()

	try {
		menuService.deleteMenu(menuId)

		return new Response(
			JSON.stringify({
				message: "successfully deleted menu.",
			})
		)
	} catch (error) {
		console.error(error)

		return new Response(
			JSON.stringify({
				message: "there was an error deleting menu",
			}),
			{ status: 500 }
		)
	}
}
