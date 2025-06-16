import { db } from "@/database"
import type {
	InsertableCategory,
	SelectableCategory,
	UpdateableCategory,
} from "@/types"

interface CategoryService {
	getCategories(limit?: number): Promise<SelectableCategory[]>
	addCategory(category: InsertableCategory): Promise<SelectableCategory>
	editCategory(
		category: Required<UpdateableCategory>
	): Promise<SelectableCategory>
	deleteCategory(
		id: SelectableCategory["id"]
	): Promise<SelectableCategory["id"]>
}

export default class CategoryServiceImpl implements CategoryService {
	async getCategories(limit = 0) {
		const categories = await db
			.selectFrom("menu_categories")
			.selectAll()
			.$if(limit !== 0, (qb) => qb.limit(limit))
			.execute()
		return categories
	}

	async addCategory({ name }: InsertableCategory) {
		const result = await db
			.insertInto("menu_categories")
			.values({ name })
			.returningAll()
			.executeTakeFirst()

		if (!result) throw new Error("error when adding category")
		return result
	}

	async editCategory({ id, name }: Required<UpdateableCategory>) {
		const result = await db
			.updateTable("menu_categories")
			.set("name", name)
			.where("id", "=", id)
			.returning(["name", "id"])
			.executeTakeFirst()

		if (!result) throw new Error("error when editing category")
		return result
	}

	async deleteCategory(id: SelectableCategory["id"]) {
		const result = await db
			.deleteFrom("menu_categories")
			.where("id", "=", id)
			.returning("id")
			.executeTakeFirst()

		if (!result) throw new Error("error when deleting category")

		return result.id
	}
}
