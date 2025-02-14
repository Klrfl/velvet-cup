import { db } from "@/database"
import { auth } from "@/lib/auth"
import type { APIRoute } from "astro"
import { z } from "astro:content"

export const POST: APIRoute = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers,
	})

	if (!session) {
		return new Response(
			JSON.stringify({
				message: "unauthorized",
			}),
			{ status: 401 }
		)
	}

	const cartSchema = z.object({
		menu_id: z.number(),
		variant_id: z.number(),
		quantity: z.number(),
	})

	const body = await request.json()

	const { data: inputCart, error } = cartSchema.safeParse(body)

	if (!inputCart || error) {
		console.error(error)

		return new Response(
			JSON.stringify({
				message: "body malformed",
			}),
			{ status: 400 }
		)
	}

	const result = await db
		.insertInto("baskets")
		.values({
			user_id: session.user.id,
			...inputCart,
		})
		.returningAll()
		.execute()

	return new Response(
		JSON.stringify({
			message: "successfully added new item to cart.",
			data: result,
		})
	)
}
