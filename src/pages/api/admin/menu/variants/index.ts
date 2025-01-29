import { db } from "@/database"
import type { APIRoute } from "astro"
import { z } from "astro:content"

export const POST: APIRoute = async ({ request }) => {
	const body = await request.json()

	const variantSchema = z
		.object({
			name: z.string(),
			values: z.array(z.object({ name: z.string() })),
		})
		.required()

	let newVariant
	try {
		newVariant = variantSchema.parse(body)
	} catch (error) {
		console.error(error)

		return new Response(
			JSON.stringify({
				message: "body malformed",
				body,
			}),
			{ status: 400 }
		)
	}

	const variantValues = await db.transaction().execute(async (trx) => {
		const variant = await trx
			.insertInto("menu_variants")
			.values({ name: newVariant.name })
			.returningAll()
			.executeTakeFirstOrThrow()

		const variantValues = await trx
			.insertInto("menu_variant_values")
			.values(
				newVariant.values.map(({ name }) => ({ name, variant_id: variant.id }))
			)
			.returningAll()
			.execute()

		return {
			...variant,
			values: [...variantValues],
		}
	})

	return new Response(
		JSON.stringify({
			message: "successfully added new menu variant.",
			data: variantValues,
		})
	)
}
