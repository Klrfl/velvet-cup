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

	const existing = await db
		.selectFrom("baskets")
		.selectAll()
		.where("baskets.menu_id", "=", inputCart.menu_id)
		.where("baskets.variant_id", "=", inputCart.variant_id)
		.where("baskets.user_id", "=", session.user.id)
		.executeTakeFirst()

	let result
	if (!existing) {
		result = await db
			.insertInto("baskets")
			.values({
				user_id: session.user.id,
				...inputCart,
			})
			.returningAll()
			.execute()
	} else {
		result = await db
			.updateTable("baskets")
			.set("quantity", existing.quantity + 1)
			.where("baskets.id", "=", existing.id)
			.returningAll()
			.executeTakeFirst()
	}

	return new Response(
		JSON.stringify({
			message: "successfully added new item to cart.",
			data: result,
		})
	)
}
