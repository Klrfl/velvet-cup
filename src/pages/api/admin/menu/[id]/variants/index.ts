import { db } from "@/database"
import type { APIRoute } from "astro"
import { menuVariantsSchema } from "@/types"

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

	const body = await request.json()
	const { data, error } = menuVariantsSchema.safeParse(body)

	if (!data || error) {
		console.error(error)

		return new Response(
			JSON.stringify({
				message: "body malformed",
			}),
			{ status: 400 }
		)
	}

	const results = await db.transaction().execute(async (tx) => {
		const result = await tx
			.insertInto("menu_variants")
			.values({ name: data.name, price: data.price, menu_id })
			.returning("id")
			.executeTakeFirst()

		if (!result) throw new Error("error when inserting new variant")

		return await tx
			.insertInto("menu_variant_options")
			.values(
				data.options.map(({ option_value_id }) => ({
					variant_id: result.id,
					option_value_id,
				}))
			)
			.execute()
	})

	results.forEach((result) => {
		if (!Number(result.numInsertedOrUpdatedRows) || !result.insertId) {
			return new Response(
				JSON.stringify({
					message: "failed to insert new menu variant",
				}),
				{ status: 500 }
			)
		}
	})

	return new Response(
		JSON.stringify({
			message: "successfully added new variant for menu id",
			data: {},
		})
	)
}
