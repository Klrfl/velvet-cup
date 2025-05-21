import type { MenuCategories } from "@/database/database.types"
import type { Selectable, Insertable, Updateable } from "kysely"

export type SelectableCategory = Selectable<MenuCategories>
export type InsertableCategory = Insertable<MenuCategories>
export type UpdateableCategory = Updateable<MenuCategories>
