import type { Kysely } from "kysely"

export async function seed(db: Kysely<any>): Promise<void> {
	await db
		.insertInto("order_status")
		.values([{ name: "pending" }, { name: "completed" }, { name: "cancelled" }])
		.execute()
}
