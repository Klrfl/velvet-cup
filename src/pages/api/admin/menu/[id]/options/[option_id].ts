import { db } from "@/database"
import type { APIRoute } from "astro"
import { z } from "astro:content"

export const PUT: APIRoute = async ({ request, params }) => {
	const { id: raw_menu_id, raw_option_id } = params
	const option_id = Number(raw_option_id)
	const menu_id = Number(raw_menu_id)

	if (isNaN(menu_id)) {
		return new Response(JSON.stringify({ message: "invalid menu id" }), {
			status: 400,
		})
	}

	if (isNaN(option_id)) {
		return new Response(JSON.stringify({ message: "invalid option id" }), {
			status: 400,
		})
	}

	const body = await request.json()

	const variantSchema = z
		.object({
			name: z.string(),
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

	const result = await db
		.updateTable("menu_options")
		.set(newVariant)
		.where("id", "=", option_id)
		.returning("id")
		.executeTakeFirst()

	if (!result) {
		return new Response(
			JSON.stringify({
				message: "error when updating option",
			}),
			{ status: 500 }
		)
	}

	// const variantValues = await db.transaction().execute(async (trx) => {
	// 	const menu_option = await trx
	// 		.updateTable("menu_options")
	// 		.set({ name: newVariant.name, menu_id })
	// 		.where("menu_options.id", "=", option_id)
	// 		.returningAll()
	// 		.executeTakeFirstOrThrow()
	//
	// 	const option_values = await trx
	// 		.updateTable("menu_option_values")
	// 		.set(
	// 			newVariant.values.map(({ name }) => ({
	// 				name,
	// 				menu_option_id: menu_option.id,
	// 			}))
	// 		)
	// 		.where("menu_option_values.id", "=")
	// 		.returningAll()
	// 		.execute()
	//
	// 	return {
	// 		...menu_option,
	// 		option_values: [...option_values],
	// 	}
	// })

	return new Response(
		JSON.stringify({
			message: "successfully added new menu variant.",
			data: result,
		})
	)
}
