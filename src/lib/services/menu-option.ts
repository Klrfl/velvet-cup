import { db } from "@/database"
import type {
	InsertableMenuOption,
	MenuItem,
	SelectableMenuOption,
	UpdateableMenuOption,
} from "@/types"

interface MenuOptionService {
	addMenuOption(
		menu_id: MenuItem["id"],
		option: InsertableMenuOption
	): Promise<SelectableMenuOption>
	editMenuOption(
		menu_id: MenuItem["id"],
		option: InsertableMenuOption
	): Promise<{ id: number }>
	deleteMenuOption(id: number): SelectableMenuOption["id"]
}

export default class MenuOptionServiceImpl implements MenuOptionService {
	async addMenuOption(menu_id: MenuItem["id"], option: InsertableMenuOption) {
		/**
		 * The menu option is made up of two tables, `menu_option` and `menu_option_values`.
		 * each menu has up to several option, and each option has up to several values
		 * However it is very important to think of the option and its values as one entity
		 * */
		const variantValues = await db.transaction().execute(async (trx) => {
			const menu_option = await trx
				.insertInto("menu_options")
				.values({ name: option.name, menu_id })
				.returningAll()
				.executeTakeFirstOrThrow()

			const option_values = await trx
				.insertInto("menu_option_values")
				.values(
					option.values.map(({ name }) => ({
						name,
						menu_option_id: menu_option.id,
					}))
				)
				.returningAll()
				.execute()

			return {
				...menu_option,
				option_values: [...option_values],
			}
		})

		return variantValues
	}

	async editMenuOption(option_id: number, option: UpdateableMenuOption) {
		const result = await db
			.updateTable("menu_options")
			.set(option)
			.where("id", "=", option_id)
			.returning("id")
			.executeTakeFirst()

		if (!result) throw new Error("Error when editing menu option")

		return result
	}

	async deleteMenuOption(id: number) {
		throw new Error("Method not implemented.")
	}
}
