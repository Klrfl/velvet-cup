import type { Selectable } from "kysely"
import type { Menu } from "@/database/database.types.ts"
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
	category_id: z.number(),
	created_at: z.coerce.date(),
	description: z.string(),
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

export type MenuComplete = z.infer<typeof menuCompleteSchema>
