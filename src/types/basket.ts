import type { Baskets } from "@/database/database.types"
import type { Insertable } from "kysely"

export type InsertableBasket = Insertable<Baskets>
export type BasketItem = {
	id: number
	menu_id: number
	quantity: number
	user_id: string
	variant_id: number
}

export type BasketComplete = {
	id: number
	quantity: number
	image: string | null
	price: string | null
	menu_name: string | null
	variant_id: number | null
	variant_name: string | null
}
