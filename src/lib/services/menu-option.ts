import type { InsertableMenuOption, SelectableMenuOption } from "@/types"

interface MenuOptionService {
	editMenuOption(option: InsertableMenuOption): SelectableMenuOption
	deleteMenuOption(id: number): SelectableMenuOption["id"]
}

export default class MenuOptionServiceImpl implements MenuOptionService {
	editMenuOption(option: InsertableMenuOption): SelectableMenuOption {
		throw new Error("Method not implemented.")
	}
	deleteMenuOption(id: number): SelectableMenuOption["id"] {
		throw new Error("Method not implemented.")
	}
}
