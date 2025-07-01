import type { Updater } from "@tanstack/vue-table"
import type { Ref } from "vue"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(
	updaterOrValue: T,
	ref: Ref
) {
	ref.value =
		typeof updaterOrValue === "function"
			? updaterOrValue(ref.value)
			: updaterOrValue
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

export async function encodeImageToBase64(image: File) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.readAsDataURL(image)

		fileReader.onloadend = () => {
			if (!fileReader.result) return reject("cannot read file for some reason")
			return resolve(fileReader.result)
		}
	})
}
