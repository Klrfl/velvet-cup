import type { InsertableMenuVariant } from "@/types"

interface MenuVariantService {
	addVariant(variant: InsertableMenuVariant): void
	updateVariant(id: number): void
}

export default class MenuVariantServiceImpl implements MenuVariantService {
	addVariant(variant: InsertableMenuVariant): void {
		throw new Error("Method not implemented.")
	}
	updateVariant(id: number): void {
		throw new Error("Method not implemented.")
	}
}
