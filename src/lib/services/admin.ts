import type { DB } from "@/database/database.types"
import type { Kysely } from "kysely"

interface DashboardMetrics {
	menu_count: number
	order_count: number
	customer_count: number
}

interface AdminService {
	getDashboardMetrics: () => Promise<DashboardMetrics>
}

export class SimpleAdminService implements AdminService {
	db: Kysely<DB>
	constructor(db: Kysely<DB>) {
		this.db = db
	}

	/**
	 * TODO: grab recent orders only
	 * maybe from past three days or past week
	 * */
	async getDashboardMetrics() {
		const results = await this.db
			.with("m", (qb) =>
				qb
					.selectFrom("menu")
					.select(({ fn }) => fn.count<number>("menu.id").as("menu_count"))
					.where("menu.deleted_at", "is", null)
			)
			.with("o", (qb) =>
				qb
					.selectFrom("orders")
					.select(({ fn }) => fn.count<number>("orders.id").as("order_count"))
			)
			.with("c", (qb) =>
				qb
					.selectFrom("user")
					.select(({ fn }) => fn.count<number>("user.id").as("customer_count"))
					.where("user.role", "<>", "admin")
			)
			.selectFrom(["m", "o", "c"])
			.select(["m.menu_count", "o.order_count", "c.customer_count"])
			.executeTakeFirst()

		if (!results) throw new Error("error when getting dashboard count")
		return results
	}
}
