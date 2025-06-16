import type { MenuVariantService } from "@/lib/services/menu-variant"
import KyselyMenuVariantService from "@/lib/services/menu-variant"

interface MenuServiceFactory {
	createService(): MenuVariantService
}

export default class KyselyMenuVariantServiceFactory
	implements MenuServiceFactory
{
	createService() {
		return new KyselyMenuVariantService()
	}
}
