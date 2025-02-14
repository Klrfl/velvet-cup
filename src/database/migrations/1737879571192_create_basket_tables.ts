import { sql, type Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("baskets")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity()
		)
		.addColumn("menu_id", "integer", (col) =>
			col.notNull().references("menu.id")
		)
		.addColumn("variant_id", "integer", (col) =>
			col.notNull().references("menu_variants.id")
		)
		.addColumn("quantity", "integer", (col) => col.notNull().defaultTo(sql`1`))
		.addColumn("user_id", "text", (col) => col.notNull().references("user.id"))
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	db.schema.dropTable("baskets").execute()
}
