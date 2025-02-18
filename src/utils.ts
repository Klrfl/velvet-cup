import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatDate(date: Date, opts?: Intl.DateTimeFormatOptions) {
	if (!opts) {
		opts = {
			dateStyle: "long",
			timeStyle: "long",
		}
	}

	return Intl.DateTimeFormat("id-ID", opts).format(date)
}

export function formatCurrency(
	amount: number,
	opts?: Intl.NumberFormatOptions
) {
	if (!opts) {
		opts = {
			currency: "IDR",
			style: "currency",
		}
	}

	return Intl.NumberFormat("id-ID", opts).format(amount)
}
