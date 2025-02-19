import { db } from "@/database"
import type { APIRoute } from "astro"
import { insertableMenuVariantsSchema } from "@/types"

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
	const { data, error } = insertableMenuVariantsSchema.safeParse(body)

	if (!data || error) {
		console.error(error)

		return new Response(
			JSON.stringify({
				message: "body malformed",
			}),
			{ status: 400 }
		)
	}

	const newVariant = await db.transaction().execute(async (tx) => {
		const newVariant = await tx
			.insertInto("menu_variants")
			.values({ name: data.name, price: data.price, menu_id })
			.returning(["name", "price", "id"])
			.executeTakeFirst()

		if (!newVariant) throw new Error("error when inserting new variant")

		const variant_id = await tx
			.insertInto("menu_variant_options")
			.values(
				data.options.map(({ option_value_id }) => ({
					variant_id: newVariant.id,
					option_value_id,
				}))
			)
			.returning("variant_id")
			.executeTakeFirst()
		return newVariant
	})

	if (!newVariant) {
		return new Response(
			JSON.stringify({
				message: "error when inserting new variant",
			}),
			{ status: 400 }
		)
	}

	const menuVariantOptions = await db
		.selectFrom("menu_variant_options as mvo")
		.leftJoin("menu_option_values as mov", "mov.id", "mvo.option_value_id")
		.leftJoin("menu_options as mo", "mo.id", "mov.menu_option_id")
		.where("mvo.variant_id", "=", newVariant.id)
		.select([
			"option_value_id",
			"mov.name as option_value",
			"mo.name as option_name",
		])
		.execute()

	return new Response(
		JSON.stringify({
			message: "successfully added new variant for menu id",
			data: {
				...newVariant,
				options: menuVariantOptions,
			},
		})
	)
}
