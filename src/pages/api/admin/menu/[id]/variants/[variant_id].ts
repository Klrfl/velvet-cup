import MenuVariantServiceImpl from "@/lib/services/menu-variant"
import type { APIRoute } from "astro"
import { z } from "astro:content"

export const PUT: APIRoute = async ({ request, params }) => {
	const { variant_id: raw_variant_id } = params
	const variant_id = Number(raw_variant_id)

	if (isNaN(variant_id)) {
		return new Response(JSON.stringify({ message: "invalid variant id" }), {
			status: 400,
		})
	}

	const body = await request.json()

	const updateableMenuVariantsSchema = z.object({
		name: z.string().nonempty(),
		price: z.coerce.number(),
	})

	const { data: inputVariant, error } =
		updateableMenuVariantsSchema.safeParse(body)
	if (error || !inputVariant) {
		console.error(error)

		return new Response(JSON.stringify({ message: "body malformed" }), {
			status: 400,
		})
	}

	const service = new MenuVariantServiceImpl()
	try {
		const result = await service.updateVariant(variant_id, inputVariant)

		return new Response(
			JSON.stringify({
				message: "successfully updated variant.",
				data: result,
			})
		)
	} catch (error) {
		console.error(error)

		return new Response(
			JSON.stringify({
				message: "error when updating variant",
			}),
			{ status: 500 }
		)
	}
}
