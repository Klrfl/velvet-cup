import BasketServiceImpl from "@/lib/services/basket"
import type { APIRoute } from "astro"
import { z } from "astro:content"

export const PUT: APIRoute = async ({ request, params }) => {
	const { id: rawId } = params
	const { data: basket_id, error: idError } = z.coerce.number().safeParse(rawId)

	if (!basket_id || idError) {
		return new Response(
			JSON.stringify({
				message: "invalid basket id",
			}),
			{ status: 400 }
		)
	}

	const body = await request.json()

	const schema = z.object({
		variant_id: z.number(),
		quantity: z.number(),
	})

	const { data, error } = schema.safeParse(body)

	if (!data || error) {
		return new Response(
			JSON.stringify({
				message: "body malformed",
			}),
			{ status: 400 }
		)
	}

	const basketService = new BasketServiceImpl()
	const result = await basketService.updateBasketItem(basket_id, data)

	if (!result) {
		return new Response(
			JSON.stringify({
				message: "an error occured when updating basket item.",
			}),
			{ status: 500 }
		)
	}

	return new Response(
		JSON.stringify({
			message: "successfully updated basket item",
			data: body,
		})
	)
}

export const DELETE: APIRoute = async ({ params }) => {
	const { id: rawId } = params

	const { data: basket_id, error } = z.coerce.number().safeParse(rawId)

	if (!basket_id || error) {
		return new Response(
			JSON.stringify({
				message: "invalid basket id",
			}),
			{ status: 400 }
		)
	}

	const basketService = new BasketServiceImpl()
	try {
		const deletedId = await basketService.deleteBasketItem(basket_id)

		return new Response(
			JSON.stringify({
				message: "successfully deleted basket item.",
				data: deletedId,
			})
		)
	} catch (error) {
		console.error(error)

		return new Response(
			JSON.stringify({
				message: "there was an error deleting basket item.",
			}),
			{ status: 500 }
		)
	}
}
