import { db } from "@/database"
import type { Menu } from "@/database/database.types"
import { adminMenuQuery, type AdminMenuReturnType } from "@/database/queries"
import type { MenuItem, MenuWithCategories } from "@/types"
import { sql, type Insertable, type Selectable } from "kysely"
import { jsonObjectFrom } from "kysely/helpers/postgres"

interface GetMenuOptions {
	limit?: number
	category_id?: number
	search_term?: string
	with_trashed?: boolean
}

// TODO: design a robust error system
interface MenuService {
	getMenus(opts: GetMenuOptions): Promise<MenuWithCategories[] | MenuItem[]>
	// TODO: infer menu used in /admin/menu/[id] correctly
	getAdminMenu(): Promise<AdminMenuReturnType>
	addMenu(menu: Insertable<Menu>): Promise<Selectable<Menu>>
	editMenu(id: number, menu: Insertable<Menu>): Promise<Selectable<Menu>>
	deleteMenu(id: number): Promise<MenuItem["id"]>
}

export default class MenuServiceImpl implements MenuService {
	async getMenus({
		limit,
		category_id = 0,
		search_term,
		with_trashed = false,
	}: GetMenuOptions): Promise<MenuWithCategories[] | MenuItem[]> {
		const menus = await db
			.selectFrom("menu")
			.select((eb) => [
				"menu.id",
				"menu.name",
				"menu.image",
				jsonObjectFrom(
					eb
						.selectFrom("menu_variants as mv")
						.select(["mv.name", "mv.price"])
						.whereRef("mv.menu_id", "=", "menu.id")
						.orderBy("mv.price asc")
						.limit(1)
				).as("variant"),
			])
			.where("deleted_at", "is", null)
			.$if(limit !== undefined, (qb) => qb.limit(limit!))
			.$if(category_id !== 0, (qb) =>
				qb.where("menu.category_id", "=", category_id)
			)
			.$if(search_term !== undefined, (qb) =>
				qb.where("menu.name", "ilike", `%${search_term}%`)
			)
			.$if(!with_trashed, (qb) => qb.where("menu.deleted_at", "is", null))
			.execute()

		return menus
	}

	async getAdminMenu() {
		const menus = await adminMenuQuery.execute()
		return menus
	}

	async addMenu(menu: Insertable<Menu>) {
		const result = await db
			.insertInto("menu")
			.values(menu)
			.returningAll()
			.executeTakeFirst()

		if (!result) throw new Error("Error when adding new menu")

		return result
	}

	async editMenu(id: number, menu: Insertable<Menu>) {
		const result = await db
			.updateTable("menu")
			.set({ ...menu, updated_at: new Date().toISOString() })
			.where("id", "=", id)
			.returningAll()
			.executeTakeFirst()

		if (!result) throw new Error("error when editing menu")

		return result
	}

	async deleteMenu(id: number) {
		const result = await db
			.updateTable("menu")
			.set("deleted_at", sql`now()`)
			.where("id", "=", id)
			.returning("id")
			.executeTakeFirst()

		if (!result) throw new Error("Error when deleting menu")

		return result.id
	}
}
