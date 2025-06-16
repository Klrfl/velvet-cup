/**
 * I would like to change the name of this type
 * at some point in the future. Currently it touches
 * too many lines of code
 *
 * It should be named MenuVariantComplete
 * */
export type MenuVariant = {
	id: number
	name: string
	price: string | number
	options: {
		option_value_id: number | null
		option_name: string
		option_value: string
	}[]
}

export type BaseMenuVariant = {
	id: number
	menu_id: number
	name: string
	price: number | string /* Postgres's numeric type is weird */
}

export type UpdateableMenuVariant = {
	name: string
	price: number
}

export type InsertableMenuVariant = {
	options: {
		option_value_id: number
	}[]
	name: string
	price: number
}
