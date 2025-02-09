import { db } from "@/database"
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
		const menu_option = await trx
			.insertInto("menu_options")
			.values({ name: newVariant.name, menu_id })
			.returningAll()
			.executeTakeFirstOrThrow()

		const option_values = await trx
			.insertInto("menu_option_values")
			.values(
				newVariant.values.map(({ name }) => ({
					name,
					menu_option_id: menu_option.id,
				}))
			)
			.returningAll()
			.execute()

		return {
			...menu_option,
			values: [...option_values],
		}
	})

	return new Response(
		JSON.stringify({
			message: "successfully added new menu variant.",
			data: variantValues,
		})
	)
}
