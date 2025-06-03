import type { DB } from "@/database/database.types"
import KyselyMenuService, { type MenuService } from "@/lib/services/menu"
import type { Kysely } from "kysely"
import { db } from "@/database"

interface MenuServiceFactory {
	createService(): MenuService
}

export default class KyselyMenuServiceFactory implements MenuServiceFactory {
	private db: Kysely<DB>

	constructor() {
		this.db = db
	}

	createService() {
		return new KyselyMenuService(this.db)
	}
}
