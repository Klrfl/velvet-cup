import type { MenuOptions } from "@/database/database.types"
import type { Selectable } from "kysely"

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
