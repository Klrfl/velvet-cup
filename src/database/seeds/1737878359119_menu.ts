import type { Kysely } from "kysely"

export async function seed(db: Kysely<any>): Promise<void> {
	await db
		.insertInto("menu_categories")
		.values([
			{ name: "food" },
			{ name: "coffee" },
			{ name: "mocktail" },
			{ name: "pizza" },
		])
		.execute()
}
