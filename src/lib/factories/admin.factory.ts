import { db } from "@/database"
import { SimpleAdminService } from "@/lib/services/admin"

export default class AdminServiceFactory {
	getService() {
		return new SimpleAdminService(db)
	}
}
