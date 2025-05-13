import type { Insertable, Selectable, Updateable } from "kysely"
import type {
	Orders as DBOrders,
	Menu,
	MenuVariants as DBMenuVariants,
	OrderDetail,
	Baskets,
	MenuOptions,
} from "@/database/database.types.ts"
import type { MenuCategories } from "@/database/database.types.js"
import { z } from "astro:content"
import type { Prettify } from "better-auth"

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

export const menuVariantSchema = z.object({
	id: z.number(),
	name: z.string().nonempty(),
	price: z.coerce.number().or(z.string()),
	options: z.array(
		z.object({
			option_value_id: z.coerce.number().nullable(),
			option_name: z.string(),
			option_value: z.string(),
		})
	),
})

export const insertableMenuVariantsSchema = z.object({
	name: z.string().nonempty(),
	price: z.coerce.number(),
	options: z.array(
		z.object({
			option_value_id: z.coerce.number(),
		})
	),
})

export const updateableMenuVariantsSchema = z.object({
	name: z.string().nonempty(),
	price: z.coerce.number(),
})

export type Orders = Selectable<DBOrders> & {
	status: string | null
	details: Selectable<OrderDetail>[]
}

export type MenuVariant = z.infer<typeof menuVariantSchema>
export type UpdateableMenuVariant = z.infer<typeof updateableMenuVariantsSchema>
export type InsertableMenuVariant = z.infer<typeof insertableMenuVariantsSchema>

export type SelectableMenuOption = Selectable<MenuOptions>
export type InsertableMenuOption = Insertable<MenuOptions>

export type MenuPrice = Omit<Selectable<DBMenuVariants>, "menu_id"> & {
	option_value: string
	option_name: string
}

export type InsertableBasket = Insertable<Baskets>
export type SelectableBasket = Selectable<Baskets>
