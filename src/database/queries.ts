import { jsonArrayFrom } from "kysely/helpers/postgres"
import { db } from "."
import type { InferResult } from "kysely"

export const adminMenuQuery = db
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
	.where("m.deleted_at", "is", null)

export type menuAdminReturnType = InferResult<typeof adminMenuQuery>

export const ordersQuery = db
	.selectFrom("orders")
	.leftJoin("order_status as os", "os.id", "orders.status_id")
	.select((eb) => [
		"orders.id",
		"orders.status_id",
		"orders.created_at",
		"os.name as status",
		jsonArrayFrom(
			eb
				.selectFrom("order_detail as od")
				.leftJoin("menu as m", "m.id", "od.menu_id")
				.select(["m.name as menu_name", "od.quantity", "od.price"])
				.whereRef("od.order_id", "=", "orders.id")
		).as("details"),
	])

export type OrderReturnType = InferResult<typeof ordersQuery>
