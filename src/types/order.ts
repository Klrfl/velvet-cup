import type { Orders as DBOrders, User } from "@/database/database.types"
import type { Prettify } from "better-auth"
import type { Selectable } from "kysely"

export type OrderStatusName = "pending" | "completed" | "cancelled"

export type OrderStatus = {
	id: number
	name: OrderStatusName
}

export type OrderDetail = {
	id: number
	menu_id: number
	notes: string | null
	order_id: string
	price: string
	quantity: number
	variant_id: number
	menu_name: string | null
}

export type Order = Prettify<
	Selectable<DBOrders> & {
		status: OrderStatusName
		details: OrderDetail[]
	}
>

export type AdminOrder = Prettify<
	Order & {
		user_name: Selectable<User>["name"]
	}
>

export type OrderUser = {
	id: string
	name: string
	email: string
}
