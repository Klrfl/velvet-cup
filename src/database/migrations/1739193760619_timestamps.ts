import { sql, type Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable("menu")
		.addColumn("updated_at", "timestamptz", (col) => col.defaultTo(sql`now()`))
		.addColumn("deleted_at", "timestamptz")
		.execute()

	await db.schema
		.alterTable("menu_variant_options")
		.dropConstraint("menu_variant_options_variant_id_fkey")
		.execute()

	await db.schema
		.alterTable("menu_variant_options")
		.addForeignKeyConstraint(
			"menu_variant_options_variant_id_fkey",
			["variant_id"],
			"menu_variants",
			["id"]
		)
		.onDelete("cascade")
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable("menu")
		.dropColumn("updated_at")
		.dropColumn("deleted_at")
		.execute()
}
