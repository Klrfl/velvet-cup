import type { Selectable } from "kysely"
import type {
	Menu,
	MenuVariants as DBMenuVariants,
} from "@/database/database.types.ts"
import type { MenuCategories } from "@/database/database.types.js"
import { z } from "astro:content"

type ModifiedCategories = {
	[K in keyof Selectable<MenuCategories> as K extends "name"
		? "category"
		: K]: Selectable<MenuCategories>[K]
}
export type MenuWithCategories = Selectable<Menu> & ModifiedCategories

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

export const menuVariantsSchema = z.object({
	id: z.number(),
	name: z.string().nonempty(),
	price: z.number(),
	options: z.array(
		z.object({
			option_value_id: z.coerce.number(),
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

export type MenuComplete = z.infer<typeof menuCompleteSchema>
export type MenuVariants = z.infer<typeof menuVariantsSchema>
export type UpdateableMenuVariant = z.infer<typeof updateableMenuVariantsSchema>
export type InsertableMenuVariants = z.infer<
	typeof insertableMenuVariantsSchema
>
export type MenuPrice = Omit<Selectable<DBMenuVariants>, "menu_id"> & {
	option_value: string
	option_name: string
}
