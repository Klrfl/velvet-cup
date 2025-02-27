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
			col.notNull().references("menu_categories.id")
		)
		.addColumn("description", "text")
		.addColumn("image", "text")
		.addColumn("created_at", "timestamptz", (col) =>
			col.notNull().defaultTo(sql`now()`)
		)
		.execute()

	await db.schema
		.createTable("menu_options")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity()
		)
		.addColumn("menu_id", "integer", (col) =>
			col.notNull().references("menu.id")
		)
		.addColumn("name", "text", (col) => col.notNull())
		.execute()

	await db.schema
		.createTable("menu_option_values")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity()
		)
		.addColumn("menu_option_id", "integer", (col) =>
			col.notNull().references("menu_options.id").onDelete("cascade")
		)
		.addColumn("name", "text", (col) => col.notNull())
		.execute()

	await db.schema
		.createTable("menu_variants")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity()
		)
		.addColumn("menu_id", "integer", (col) =>
			col.notNull().references("menu.id")
		)
		.addColumn("name", "text", (col) => col.notNull())
		.addColumn("price", "numeric", (col) => col.notNull())
		.execute()

	await db.schema
		.createTable("menu_variant_options")
		.addColumn("variant_id", "integer", (col) =>
			col.notNull().references("menu_variants.id")
		)
		.addColumn("option_value_id", "integer", (col) =>
			col.notNull().references("menu_option_values.id")
		)
		.addPrimaryKeyConstraint("primary_key", ["variant_id", "option_value_id"])
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	db.schema.dropTable("menu_categories").cascade().execute()
	db.schema.dropTable("menu_options").cascade().execute()
	db.schema.dropTable("menu_option_values").cascade().execute()
	db.schema.dropTable("menu_variants").cascade().execute()
	db.schema.dropTable("menu_variant_options").cascade().execute()
	db.schema.dropTable("menu").cascade().execute()
}
