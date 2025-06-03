import KyselyMenuVariantServiceFactory from "@/lib/factories/menu-variant.factory"
import type { APIRoute } from "astro"
import { z } from "astro:content"

export const POST: APIRoute = async ({ request, params }) => {
	const { id } = params
	const menu_id = Number(id)

	if (isNaN(menu_id)) {
		return new Response(
			JSON.stringify({
				message: "invalid menu id",
			}),
			{ status: 400 }
		)
	}

	const schema = z.object({
		name: z.string().nonempty(),
		price: z.coerce.number(),
		options: z.array(
			z.object({
				option_value_id: z.coerce.number(),
			})
		),
	})

	const body = await request.json()
	const { data: newVariant, error } = schema.safeParse(body)

	if (!newVariant || error) {
		console.error(error)

		return new Response(
			JSON.stringify({
				message: "body malformed",
			}),
			{ status: 400 }
		)
	}

	const service = new KyselyMenuVariantServiceFactory().createService()
	try {
		const result = await service.addVariant(menu_id, newVariant)

		return new Response(
			JSON.stringify({
				message: "successfully added new variant for menu id",
				data: result,
			})
		)
	} catch (error) {
		console.error(error)
		return new Response(
			JSON.stringify({
				message: "error when inserting new variant",
			}),
			{ status: 400 }
		)
	}
}
