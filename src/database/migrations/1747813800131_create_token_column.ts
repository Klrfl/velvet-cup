import type { Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable("orders")
		.addColumn("token", "text", (col) => col.notNull().defaultTo(""))
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.alterTable("orders").dropColumn("token").execute()
}
