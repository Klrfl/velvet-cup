import { db } from "@/database"
import type {
	BaseMenuVariant,
	InsertableMenuVariant,
	MenuItem,
	MenuVariant,
	UpdateableMenuVariant,
} from "@/types"

interface MenuVariantService {
	addVariant(
		menu_id: MenuItem["id"],
		variant: InsertableMenuVariant
	): Promise<MenuVariant>
	updateVariant(
		id: MenuVariant["id"],
		variant: UpdateableMenuVariant
	): Promise<BaseMenuVariant>
}

export default class MenuVariantServiceImpl implements MenuVariantService {
	async addVariant(menu_id: MenuItem["id"], variant: InsertableMenuVariant) {
		const newVariant = await db.transaction().execute(async (tx) => {
			const newVariant = await tx
				.insertInto("menu_variants")
				.values({ name: variant.name, price: variant.price, menu_id })
				.returning(["name", "price", "id"])
				.executeTakeFirst()

			if (!newVariant) throw new Error("error when inserting new variant")

			const variantInsertResult = await tx
				.insertInto("menu_variant_options")
				.values(
					variant.options.map(({ option_value_id }) => ({
						variant_id: newVariant.id,
						option_value_id,
					}))
				)
				.returning("variant_id")
				.executeTakeFirst()

			const menuVariantOptions = await db
				.selectFrom("menu_variant_options as mvo")
				.leftJoin("menu_option_values as mov", "mov.id", "mvo.option_value_id")
				.leftJoin("menu_options as mo", "mo.id", "mov.menu_option_id")
				.where("mvo.variant_id", "=", variantInsertResult?.variant_id!)
				.select([
					"option_value_id",
					"mov.name as option_value",
					"mo.name as option_name",
				])
				.execute()

			return { ...newVariant, options: menuVariantOptions }
		})

		return newVariant as MenuVariant
	}

	async updateVariant(id: MenuVariant["id"], variant: UpdateableMenuVariant) {
		const newVariant = await db
			.updateTable("menu_variants as mv")
			.set(variant)
			.where("id", "=", id)
			.returningAll()
			.executeTakeFirst()

		if (!newVariant) throw new Error("Error when updating variant")

		return newVariant
	}
}
