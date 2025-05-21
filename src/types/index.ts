import type { Selectable } from "kysely"
import type {
	Orders as DBOrders,
	MenuVariants,
	OrderDetail,
} from "@/database/database.types.ts"
export type { BasketItem, BasketComplete, InsertableBasket } from "./basket"
export type {
	MenuItem,
	MenuComplete,
	MenuWithPrice,
	MenuWithCategories,
} from "./menu"
export type {
	SelectableCategory,
	InsertableCategory,
	UpdateableCategory,
} from "./menu-category"
export type {
	MenuVariant,
	BaseMenuVariant,
	InsertableMenuVariant,
	UpdateableMenuVariant,
} from "./menu-variant"

/**
 * TODO:
 * - export all types from @/database/queries.ts, type them manually idc
 * */

export type Orders = Selectable<DBOrders> & {
	status: string | null
	details: Selectable<OrderDetail>[]
}

export type MenuPrice = Omit<Selectable<MenuVariants>, "menu_id"> & {
	option_value: string
	option_name: string
}
