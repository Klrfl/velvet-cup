import { sql, type Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("menu_categories")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity()
		)
		.addColumn("name", "text", (col) => col.notNull())
		.execute()

	await db.schema
		.createTable("menu")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity()
		)
		.addColumn("name", "text", (col) => col.notNull())
		.addColumn("category_id", "integer", (col) =>
			col.references("menu_categories.id")
		)
		.addColumn("description", "text")
		.addColumn("image", "text")
		.addColumn("created_at", "timestamptz", (col) => col.defaultTo(sql`now()`))
		.execute()

	await db.schema
		.createTable("menu_items")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity()
		)
		.addColumn("menu_id", "integer", (col) =>
			col.references("menu.id").onDelete("cascade")
		)
		.addColumn("name", "text", (col) => col.notNull())
		.addColumn("image", "text")
		.execute()

	await db.schema
		.createTable("menu_variants")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity()
		)
		.addColumn("name", "text", (col) => col.notNull())
		.execute()

	await db.schema
		.createTable("menu_variant_values")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity()
		)
		.addColumn("name", "text", (col) => col.notNull())
		.execute()

	await db.schema
		.createTable("menu_configuration")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity()
		)
		.addColumn("menu_item_id", "integer", (col) =>
			col.references("menu_items.id")
		)
		.addColumn("variant_id", "integer", (col) =>
			col.references("menu_variants.id")
		)
		.addColumn("variant_value_id", "integer", (col) =>
			col.references("menu_variant_values.id")
		)
		.addColumn("price", "numeric", (col) => col.notNull())
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	db.schema.dropTable("menu_categories").cascade().execute()
	db.schema.dropTable("menu_items").execute()
	db.schema.dropTable("menu").execute()
}
