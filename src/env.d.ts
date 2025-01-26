interface ImportMetaEnv {
	readonly DB_DATABASE: string | null
	readonly DB_PASSWORD: string | null
	readonly DB_USER: string | null
	readonly DB_HOST: string | null
	readonly DB_PORT: number | null
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
