import { db } from "@/database"
import type { User } from "@/database/database.types"
import type { BasketComplete, BasketItem } from "@/types"
import { sql, type Selectable } from "kysely"

interface GetBasketOptions {
	limit?: number
	userId: Selectable<User>["id"]
}

interface BasketService {
	getBasketItems(opts: GetBasketOptions): Promise<BasketItem[]>
	getBasketCount(userId: string): Promise<{ value: number }>
	addItemToBasket(
		item: Pick<BasketItem, "menu_id" | "variant_id" | "quantity">,
		userId: string
	): Promise<BasketItem | null>
	updateBasketItem(
		id: BasketItem["id"],
		item: Pick<BasketItem, "quantity" | "variant_id">
	): Promise<BasketItem>
	deleteBasketItem(id: BasketItem["id"]): Promise<BasketItem["id"]>
}

export default class BasketServiceImpl implements BasketService {
	async getBasketItems({ limit = 0, userId }: GetBasketOptions) {
		const baskets = await db
			.selectFrom("baskets as b")
			.leftJoin("menu as m", "m.id", "b.menu_id")
			.leftJoin("menu_variants as mv", (join) =>
				join
					.onRef("mv.menu_id", "=", "m.id")
					.onRef("mv.id", "=", "b.variant_id")
			)
			.select((eb) => [
				"b.id",
				"b.menu_id",
				"b.user_id",
				"m.name as menu_name",
				"m.image",
				"b.quantity",
				eb.fn.coalesce("mv.id", sql<number>`0`).as("variant_id"),
				"mv.name as variant_name",
				"mv.price",
			])
			.where("b.user_id", "=", userId)
			.$if(limit !== 0, (qb) => qb.limit(limit))
			.execute()

		return baskets
	}

	async getBasketCount(userId: string) {
		const result = await db
			.selectFrom("baskets")
			.select((eb) => [
				eb.fn.coalesce(eb.fn.sum<number>("quantity"), sql`0`).as("value"),
			])
			.where("user_id", "=", userId)
			.executeTakeFirst()

		if (!result) throw Error("error when getting count")

		return result
	}

	// TODO: refactor query to an upsert
	async addItemToBasket(
		item: Pick<BasketItem, "menu_id" | "variant_id" | "quantity">,
		userId: string
	) {
		const existing = await db
			.selectFrom("baskets")
			.selectAll()
			.where("baskets.menu_id", "=", item.menu_id)
			.where("baskets.variant_id", "=", item.variant_id)
			.where("baskets.user_id", "=", userId)
			.executeTakeFirst()

		let result
		if (!existing) {
			console.log("existing basket item doesn't exist, adding a new one...")

			result = await db
				.insertInto("baskets")
				.values({
					...item,
					user_id: userId,
				})
				.returningAll()
				.executeTakeFirst()
		} else {
			result = await db
				.updateTable("baskets")
				.set("quantity", existing.quantity + 1)
				.where("baskets.id", "=", existing.id)
				.returningAll()
				.executeTakeFirst()
		}

		if (!result) return null
		return result
	}

	async updateBasketItem(
		id: BasketItem["id"],
		data: Pick<BasketItem, "variant_id" | "quantity">
	) {
		const result = await db
			.updateTable("baskets")
			.set(data)
			.where("id", "=", id)
			.returningAll()
			.executeTakeFirst()

		if (!result) throw new Error("error when updating basket item")

		return result
	}

	async deleteBasketItem(id: BasketComplete["id"]) {
		const result = await db
			.deleteFrom("baskets")
			.where("id", "=", id)
			.returning("id")
			.executeTakeFirst()

		if (!result) throw new Error("error when deleting basket item")

		return result.id
	}
}
