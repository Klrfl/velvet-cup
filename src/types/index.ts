import type { Insertable, Selectable } from "kysely"
import type {
	Orders as DBOrders,
	Menu,
	MenuVariants as DBMenuVariants,
	OrderDetail,
	Baskets,
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
/**
 * This type is used to be in conjunction with Menu
 * so that when we fetch menu with categories, the category object will be
 * merged and be flattened together with Menu
 * */
type ModifiedCategories = {
	[K in keyof Selectable<MenuCategories> as K extends "name"
		? "category"
		: K]: Selectable<MenuCategories>[K]
}
export type MenuWithCategories = Prettify<Selectable<Menu> & ModifiedCategories>

const menuCompleteSchema = z.object({
	id: z.number(),
	name: z.string(),
	image: z.string().optional(),
	category_id: z.number(),
	category: z.string(),
	created_at: z.coerce.date(),
	description: z.string().optional(),
	options: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			option_values: z.array(
				z.object({
					id: z.number(),
					menu_option_id: z.number(),
					name: z.string(),
				})
			),
		})
	),
})

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
export type MenuComplete = Prettify<z.infer<typeof menuCompleteSchema>>
export type MenuVariant = z.infer<typeof menuVariantSchema>
export type UpdateableMenuVariant = z.infer<typeof updateableMenuVariantsSchema>
export type InsertableMenuVariants = z.infer<
	typeof insertableMenuVariantsSchema
>
export interface MenuItem {
	id: number
	name: string
	image: string | null
	variant: {
		name: string
		price: string
	} | null
}

export type MenuPrice = Omit<Selectable<DBMenuVariants>, "menu_id"> & {
	option_value: string
	option_name: string
}

export type InsertableBasket = Insertable<Baskets>
export type SelectableBasket = Selectable<Baskets>
