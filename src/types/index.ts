import type { Insertable, Selectable, Updateable } from "kysely"
import type {
	Orders as DBOrders,
	MenuVariants as DBMenuVariants,
	OrderDetail,
	Baskets,
	MenuOptions,
} from "@/database/database.types.ts"
import type { MenuCategories } from "@/database/database.types.js"

/**
 * TODO:
 * - export all types from @/database/queries.ts, type them manually idc
 * - export all types generated from zod schemas (less important)
 * */

// categories
export type SelectableCategory = Selectable<MenuCategories>
export type InsertableCategory = Insertable<MenuCategories>
export type UpdateableCategory = Updateable<MenuCategories>

/**
 * base type for menu, with all the possible attributes
 * a menu item could have
 * */
export type MenuComplete = {
	created_at: Date
	deleted_at: Date | null
	updated_at: Date | null
	description: string | null
	id: number
	image: string | null
	name: string
	variant?: {
		name: string
		price: string
	} | null
	category_id: number
	category?: string | undefined
	options?: {
		id: number
		name: string
		option_values: {
			id: number
			menu_option_id: number
			name: string
		}[]
	}[]
} & {
	variants: {
		id: number
		name: number
		price: string
		option_name: string
		option_value: string
	}[]
}

export type MenuItem = Omit<MenuComplete, "options" | "variants">
export type MenuWithPrice = Omit<MenuComplete, "options" | "variant">

/**
 * should have been named MenuWithCategory but whatever
 * */
export type MenuWithCategories = Omit<
	MenuComplete,
	"options" | "variant" | "variants"
>

export type Orders = Selectable<DBOrders> & {
	status: string | null
	details: Selectable<OrderDetail>[]
}

/**
 * I would like to change the name of this type
 * at some point in the future. Currently it touches
 * too many lines of code
 *
 * It should be named MenuVariantComplete
 * */
export type MenuVariant = {
	id: number
	name: string
	price: string | number
	options: {
		option_value_id: number | null
		option_name: string
		option_value: string
	}[]
}

export type BaseMenuVariant = {
	id: number
	menu_id: number
	name: string
	price: number | string /* Postgres's numeric type is weird */
}

export type UpdateableMenuVariant = {
	name: string
	price: number
}

export type InsertableMenuVariant = {
	options: {
		option_value_id: number
	}[]
	name: string
	price: number
}

export type SelectableMenuOption = Selectable<MenuOptions>
export type InsertableMenuOption = {
	name: string
	values: {
		name: string
	}[]
}
/**
 * TODO:
 * change this type when I figure out the logic
 * to update other props of the menu option
 * */
export type UpdateableMenuOption = {
	name: string
}

export type MenuPrice = Omit<Selectable<DBMenuVariants>, "menu_id"> & {
	option_value: string
	option_name: string
}

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
