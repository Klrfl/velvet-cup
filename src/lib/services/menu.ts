import { db } from "@/database"
import type { DB, Menu } from "@/database/database.types"
import type { MenuItem } from "@/types"
import {
	Kysely,
	sql,
	type InferResult,
	type Insertable,
	type Selectable,
} from "kysely"
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres"

/**
 * TOOD: get rid of this
 * do I directly just copy the queries one by one?
 * I think that's the only solution
 * */
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

/**
 * TODO: move this type somewhere else
 * */
export type AdminMenuReturnType = InferResult<typeof adminMenuQuery>

/**
 * TODO: move this type somewhere else
 * */
const menuAttributes = ["variants", "price", "category", "regular"] as const
type MenuAttributes = (typeof menuAttributes)[number]

interface GetMenuOptions {
	limit?: number
	category_id?: number
	search_term?: string
	with?: MenuAttributes[]
	with_trashed?: boolean
}

interface GetAdminMenuOptions {
	limit?: number
	with_trashed?: boolean
}
// TODO: design a robust error system
export interface MenuService {
	getMenus(opts: GetMenuOptions): Promise<MenuItem[]>
	getMenu(id: number): Promise<MenuItem | null>
	// TODO: infer menu used in /admin/menu/[id] correctly
	getAdminMenus(opts: GetAdminMenuOptions): Promise<AdminMenuReturnType>
	getAdminMenu(id: number): Promise<AdminMenuReturnType[0]>
	addMenu(menu: Insertable<Menu>): Promise<Selectable<Menu>>
	editMenu(id: number, menu: Insertable<Menu>): Promise<Selectable<Menu>>
	deleteMenu(id: number): Promise<MenuItem["id"]>
}

export default class KyselyMenuService implements MenuService {
	private db: Kysely<DB>

	constructor(db: Kysely<DB>) {
		this.db = db
	}

	async getMenus({
		limit,
		category_id = 0,
		search_term,
		with_trashed = false,
		with: withArg = ["category"],
	}: GetMenuOptions) {
		const menus = await this.db
			.selectFrom("menu")
			.select([
				"menu.id",
				"menu.name",
				"menu.image",
				"menu.category_id",
				"menu.created_at",
				"menu.description",
				"deleted_at",
				"updated_at",
			])
			// for individual menu items, we need only
			// one of the variants to get the base price
			.$if(withArg.includes("price"), (qb) =>
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
			.$if(withArg.includes("category"), (qb) =>
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
		const menu = await this.db
			.selectFrom("menu")
			.select([
				"menu.id",
				"menu.name",
				"menu.image",
				"menu.category_id",
				"menu.description",
				"menu.created_at",
				"menu.updated_at",
				"menu.deleted_at",
			])
			.select((eb) => [
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
							eb.fn.coalesce("mo.name", sql<string>`''`).as("option_name"),
							eb.fn.coalesce("mov.name", sql<string>`''`).as("option_value"),
						])
						.whereRef("mv.menu_id", "=", "menu.id")
				).as("variants"),
			])
			.where("menu.id", "=", id)
			.where("deleted_at", "is", null)
			.executeTakeFirst()

		if (!menu) return null

		return menu
	}

	async getAdminMenus({ limit = 0, with_trashed = false }) {
		const menus = await adminMenuQuery
			.$if(limit !== 0, (qb) => qb.limit(limit))
			.$if(!with_trashed, (qb) => qb.where("deleted_at", "is", null))
			.where("m.deleted_at", "is", null)
			.execute()

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
		const result = await this.db
			.insertInto("menu")
			.values(menu)
			.returningAll()
			.executeTakeFirst()

		if (!result) throw new Error("Error when adding new menu")

		return result
	}

	async editMenu(id: number, menu: Insertable<Menu>) {
		const result = await this.db
			.updateTable("menu")
			.set({ ...menu, updated_at: new Date().toISOString() })
			.where("id", "=", id)
			.returningAll()
			.executeTakeFirst()

		if (!result) throw new Error("error when editing menu")

		return result
	}

	async deleteMenu(id: number) {
		const result = await this.db
			.updateTable("menu")
			.set("deleted_at", sql`now()`)
			.where("id", "=", id)
			.returning("id")
			.executeTakeFirst()

		if (!result) throw new Error("Error when deleting menu")

		return result.id
	}
}
