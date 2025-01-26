import type { Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("baskets")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity()
		)
		.addColumn("user_id", "integer", (col) => col.references("users.id"))
		.execute()

	await db.schema
		.createTable("basket_items")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity()
		)
		.addColumn("menu_item_id", "integer", (col) =>
			col.references("menu_items.id")
		)
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	db.schema.dropTable("basket_items").execute()
	db.schema.dropTable("baskets").execute()
}
