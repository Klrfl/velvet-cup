import type { BasketReturnType } from "@/database/queries"
import type { InsertableBasket, SelectableBasket } from "@/types"

interface BasketService {
	getBasketItems(limit: number): BasketReturnType
	getBasketItem(id: InsertableBasket["id"]): BasketReturnType[number]
	getBasketCount(userId: number): number
	addItemToBasket(item: InsertableBasket): BasketReturnType
	updateBasketItem(id: SelectableBasket["id"]): BasketReturnType
	deleteBasketItem(id: SelectableBasket["id"]): BasketReturnType[number]["id"]
}

export default class BasketServiceImpl implements BasketService {
	getBasketItems(limit: number): BasketReturnType {
		throw new Error("Method not implemented.")
	}
	getBasketItem(id: InsertableBasket["id"]): BasketReturnType[number] {
		throw new Error("Method not implemented.")
	}
	getBasketCount(userId: number): number {
		throw new Error("Method not implemented.")
	}
	addItemToBasket(item: InsertableBasket): BasketReturnType {
		throw new Error("Method not implemented.")
	}
	updateBasketItem(id: SelectableBasket["id"]): BasketReturnType {
		throw new Error("Method not implemented.")
	}
	deleteBasketItem(id: SelectableBasket["id"]) {
		throw new Error("Method not implemented.")
	}
}
