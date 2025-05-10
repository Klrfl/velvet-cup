import { db } from "@/database"
import type { Menu } from "@/database/database.types"
import { type AdminMenuReturnType } from "@/database/queries"
import type { MenuComplete, MenuItem, MenuWithCategories } from "@/types"
import { sql, type Insertable, type Selectable } from "kysely"
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres"

const menuQuery = db
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

const adminMenuQuery = db
	.selectFrom("menu as m")
	.leftJoin("menu_categories as c", "c.id", "m.category_id")
	.select((eb) => [
		"m.id",
		"m.name",
		"m.image",
		"m.category_id",
		"m.created_at",
		"m.description",
		"c.name as category",
		jsonArrayFrom(
			eb
				.selectFrom("menu_options as mo")
				.whereRef("mo.menu_id", "=", "m.id")
				.select((eb) => [
					"mo.id",
					"mo.name",
					jsonArrayFrom(
						eb
							.selectFrom("menu_option_values as mov")
							.whereRef("mov.menu_option_id", "=", "mo.id")
							.select(["menu_option_id", "id", "name"])
					).as("option_values"),
				])
		).as("options"),
	])

interface GetMenuOptions {
	limit?: number
	category_id?: number
	search_term?: string
	with?: "variant" | "category" | "variant_and_category" | "regular"
	with_trashed?: boolean
}

interface GetAdminMenuOptions {
	limit?: number
	with_trashed?: boolean
}

/**
 * when `with` is set to `category`, I want to return MenuWithCategories[]
 * when `with` is set to `variant`, I want to return something else
 * */
type ReturnableMenu<T extends GetMenuOptions> = T["with"] extends "category"
	? MenuWithCategories[]
	: MenuItem[]

// TODO: design a robust error system
interface MenuService {
	getMenus<T extends GetMenuOptions>(
		opts: GetMenuOptions
	): Promise<ReturnableMenu<T>>
	getMenu(id: number): Promise<MenuComplete | null>
	// TODO: infer menu used in /admin/menu/[id] correctly
	getAdminMenus(opts: GetAdminMenuOptions): Promise<AdminMenuReturnType>
	getAdminMenu(id: number): Promise<AdminMenuReturnType[0]>
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
		with: withArg = "category",
	}: GetMenuOptions) {
		const menus = await db
			.selectFrom("menu")
			.select([
				"menu.id",
				"menu.name",
				"menu.image",
				"menu.created_at",
				"menu.description",
			])
			// for home page and search, we need variants to get the price
			.$if(withArg === "variant", (qb) =>
				qb.select((eb) => [
					jsonObjectFrom(
						eb
							.selectFrom("menu_variants as mv")
							.select(["mv.name", "mv.price"])
							.whereRef("mv.menu_id", "=", "menu.id")
							.orderBy("mv.price asc")
							.limit(1)
					).as("variant"),
				])
			)
			// for admin menu we need to fetch with categories
			.$if(withArg === "category", (qb) =>
				qb
					.leftJoin("menu_categories as c", "c.id", "menu.category_id")
					.select(({ fn }) =>
						fn.coalesce("c.name", sql.lit("no category")).as("category")
					)
			)
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

	async getMenu(id: number) {
		const menu = await menuQuery
			.leftJoin("menu_categories as c", "c.id", "menu.category_id")
			.select((eb) => [
				"menu.category_id",
				"menu.description",
				"c.name as category_name",
				jsonArrayFrom(
					eb
						.selectFrom("menu_variants as mv")
						.leftJoin("menu_variant_options as mvo", "mvo.variant_id", "mv.id")
						.leftJoin(
							"menu_option_values as mov",
							"mov.id",
							"mvo.option_value_id"
						)
						.leftJoin("menu_options as mo", "mov.menu_option_id", "mo.id")
						.select((eb) => [
							"mv.id",
							"mv.name",
							"mv.price",
							eb.fn.coalesce("mov.name", sql<string>`''`).as("option_value"),
							eb.fn.coalesce("mo.name", sql<string>`''`).as("option_name"),
						])
						.whereRef("mv.menu_id", "=", "menu.id")
				).as("variants"),
			])
			.where("menu.id", "=", id)
			.executeTakeFirst()

		if (!menu) return null
		return menu
	}

	async getAdminMenus({ limit = 0, with_trashed = false }) {
		const menus = await adminMenuQuery
			.$if(limit !== 0, (qb) => qb.limit(limit))
			.$if(!with_trashed, (qb) => qb.where("deleted_at", "is", null))
			.where("m.deleted_at", "is", null)
			.executeTakeFirst()

		if (!menus) return []

		return menus
	}

	async getAdminMenu(id: number) {
		const menu = await adminMenuQuery
			.where("m.id", "=", id)
			.where("deleted_at", "is", null)
			.executeTakeFirst()

		if (!menu) throw new Error("error when getting menu item")

		return menu
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
