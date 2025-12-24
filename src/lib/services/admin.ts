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

			if (!kpi) throw new Error("failed to fetch kpi")

			const order_stats = await tx
				.with(
					"dates",
					() =>
						// with raw queries like this you
						// have to write the brackets yourself
						sql`(
            	select generate_series(
            		CURRENT_DATE - interval '59 days',
            		CURRENT_DATE, '1 day'
            	)::date as ordered_at
            )`
				)
				.with("orders", (qb) =>
					qb
						.selectFrom("orders as o")
						.select(() => [
							sql<number>`coalesce(count(o.created_at)::int, 0)`.as(
								"order_count"
							),
							sql<Date>`dates.ordered_at`.as("ordered_at"),
						])
						.groupBy(sql`o.created_at::date`)
				)
				.with("cancelled_orders", (qb) =>
					qb
						.selectFrom("orders as o")
						.select(() => [
							sql`coalesce(count(o.created_at)::int, 0)`.as("cancelled_count"),
							sql<Date>``,
						])
						.leftJoin("order_status as os", "os.id", "o.status_id")
						.where("os.name", "=", "cancelled")
				)
				.selectFrom("orders as o")
				.select(() => [
					sql<number>`coalesce(count(o.created_at)::int, 0)`.as("order_count"),
					sql<Date>`dates.ordered_at`.as("ordered_at"),
				])
				.rightJoin("dates", (join) =>
					join.on(sql`o.created_at::date  = dates.ordered_at`)
				)
				.groupBy("dates.ordered_at")
				.orderBy("dates.ordered_at")
				.execute()

			return { kpi, chart: { order_stats } }
		})

		return result
	}
}
