/**
 * base type for menu, with all the possible attributes
 * a menu item could have
 * */
export type MenuComplete = {
	created_at: Date
	deleted_at: Date | null
	updated_at: Date | null
	description: string | null
	id: number
	image: string | null
	name: string
	variant?: {
		name: string
		price: string
	} | null
	category_id: number
	category?: string | undefined
	options?: {
		id: number
		name: string
		option_values: {
			id: number
			menu_option_id: number
			name: string
		}[]
	}[]
} & {
	variants: {
		id: number
		name: number
		price: string
		option_name: string
		option_value: string
	}[]
}

export type MenuItem = Omit<MenuComplete, "options" | "variants">
export type MenuWithPrice = Omit<MenuComplete, "options" | "variant">

/**
 * should have been named MenuWithCategory but whatever
 * */
export type MenuWithCategories = Omit<
	MenuComplete,
	"options" | "variant" | "variants"
>
