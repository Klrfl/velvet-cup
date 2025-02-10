import { sql, type Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable("menu")
		.addColumn("updated_at", "timestamptz", (col) => col.defaultTo(sql`now()`))
		.addColumn("deleted_at", "timestamptz")
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable("menu")
		.dropColumn("updated_at")
		.dropColumn("deleted_at")
		.execute()
}
