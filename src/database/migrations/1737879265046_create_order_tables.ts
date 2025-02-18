import { sql, type Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("order_status")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity()
		)
		.addColumn("name", "text", (col) => col.notNull())
		.execute()

	await db.schema
		.createTable("orders")
		.addColumn("id", "uuid", (col) =>
			col.primaryKey().defaultTo(sql`gen_random_uuid()`)
		)
		.addColumn("user_id", "text", (col) => col.notNull().references("user.id"))
		.addColumn("status_id", "integer", (col) => col.notNull())
		.addColumn("created_at", "timestamptz", (col) =>
			col.notNull().defaultTo(sql`now()`)
		)
		.execute()

	await db.schema
		.createTable("order_detail")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity()
		)
		.addColumn("order_id", "uuid", (col) =>
			col.notNull().references("orders.id")
		)
		.addColumn("menu_id", "integer", (col) =>
			col.notNull().references("menu.id")
		)
		.addColumn("variant_id", "integer", (col) =>
			col.notNull().references("menu_variants.id")
		)
		.addColumn("price", "numeric", (col) => col.notNull())
		.addColumn("quantity", "integer", (col) => col.notNull())
		.addColumn("notes", "text")
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("order_status").cascade().execute()
	await db.schema.dropTable("orders").cascade().execute()
	await db.schema.dropTable("order_detail").cascade().execute()
}
