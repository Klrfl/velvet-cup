import type { SelectableCategory } from "@/types"

interface CategoryService {
	getCategories(limit?: number): SelectableCategory[]
	addCategory(name: SelectableCategory["name"]): SelectableCategory
	editCategory(id: SelectableCategory["id"]): SelectableCategory
	deleteCategory(id: SelectableCategory["id"]): SelectableCategory["id"]
}

export default class CategoryServiceImpl implements CategoryService {
	getCategories(limit?: number): SelectableCategory[] {
		throw new Error("Method not implemented.")
	}
	addCategory(name: SelectableCategory["name"]): SelectableCategory {
		throw new Error("Method not implemented.")
	}
	editCategory(id: SelectableCategory["id"]): SelectableCategory {
		throw new Error("Method not implemented.")
	}
	deleteCategory(id: SelectableCategory["id"]): SelectableCategory["id"] {
		throw new Error("Method not implemented.")
	}
}
