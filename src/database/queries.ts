import { jsonArrayFrom } from "kysely/helpers/postgres"
import { db } from "."
import type { InferResult } from "kysely"

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
				.select(["od.id", "m.name as menu_name", "od.quantity", "od.price"])
				.whereRef("od.order_id", "=", "orders.id")
		).as("details"),
	])

export type OrderReturnType = InferResult<typeof ordersQuery>

export const adminOrdersQuery = ordersQuery
	.leftJoin("user as u", "u.id", "orders.user_id")
	.select("u.name as user_name")

export type AdminOrdersReturnType = InferResult<typeof adminOrdersQuery>
