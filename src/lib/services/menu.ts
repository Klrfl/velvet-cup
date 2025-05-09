import type { Menu } from "@/database/database.types"
import type { AdminMenuReturnType } from "@/database/queries"
import type { MenuItem, MenuWithCategories } from "@/types"
import type { Insertable } from "kysely"

export type ReturnableMenuItem = {}

interface GetMenuOptions {
	limit?: number
}

// TODO: design a robust error system
interface MenuService {
	getMenus({ limit }: GetMenuOptions): MenuWithCategories[] | MenuItem[]
	// TODO: infer menu used in /admin/menu/[id] correctly
	getAdminMenu(): AdminMenuReturnType
	addMenu(menu: Insertable<Menu>): MenuItem
	editMenu(id: number): MenuItem
	deleteMenu(id: number): MenuItem["id"]
}

export default class MenuServiceImpl implements MenuService {
	getAdminMenu(): MenuWithCategories {
		throw new Error("Method not implemented.")
	}
	getMenus(): MenuWithCategories | MenuItem {
		throw new Error("Method not implemented.")
	}
	addMenu(menu: Insertable<Menu>): MenuItem {
		throw new Error("Method not implemented.")
	}
	editMenu(id: number): MenuItem {
		throw new Error("Method not implemented.")
	}

	deleteMenu(id: number): MenuItem["id"] {
		throw new Error("Method not implemented.")
	}
}
