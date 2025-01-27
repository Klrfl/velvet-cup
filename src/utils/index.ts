export function formatDate(date: Date, opts?: Intl.DateTimeFormatOptions) {
	if (!opts) {
		opts = {
			dateStyle: "long",
			timeStyle: "long",
		}
	}

	return Intl.DateTimeFormat("id-ID", opts).format(date)
}
