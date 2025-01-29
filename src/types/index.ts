import type { Selectable } from "kysely"
import type { Menu } from "@/database/database.types.ts"
import type { MenuCategories } from "@/database/database.types.js"

type ModifiedCategories = {
	[K in keyof Selectable<MenuCategories> as K extends "name"
		? "category"
		: K]: Selectable<MenuCategories>[K]
}
export type MenuWithCategories = Selectable<Menu> & ModifiedCategories
