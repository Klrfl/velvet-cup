import { db } from "@/database"
import { updateableMenuVariantsSchema } from "@/types"
import type { APIRoute } from "astro"

export const PUT: APIRoute = async ({ request, params }) => {
	const { variant_id: raw_variant_id } = params
	const variant_id = Number(raw_variant_id)

	if (isNaN(variant_id)) {
		return new Response(JSON.stringify({ message: "invalid variant id" }), {
			status: 400,
		})
	}

	const body = await request.json()

	const { data: inputVariant, error } =
		updateableMenuVariantsSchema.safeParse(body)
	if (error || !inputVariant) {
		console.error(error)

		return new Response(JSON.stringify({ message: "body malformed" }), {
			status: 400,
		})
	}

	const newVariant = db
		.updateTable("menu_variants as mv")
		.set(inputVariant)
		.where("id", "=", variant_id)
		.returningAll()
		.executeTakeFirst()

	return new Response(
		JSON.stringify({
			message: "successfully updated variant.",
			data: newVariant,
		})
	)
}
