import type { DB } from "@/database/database.types"
import KyselyMenuService, { type MenuService } from "@/lib/services/menu"
import type { Kysely } from "kysely"

interface MenuServiceFactory {
	createService(db: Kysely<DB>): MenuService
}

export default class KyselyMenuServiceFactory implements MenuServiceFactory {
	createService(db: Kysely<DB>) {
		return new KyselyMenuService(db)
	}
}
