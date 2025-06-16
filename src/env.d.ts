/// <reference types="astro/client" />

import type { Session } from "@/lib/auth"

interface ImportMetaEnv {
	readonly DB_DATABASE: string | null
	readonly DB_PASSWORD: string | null
	readonly DB_USER: string | null
	readonly DB_HOST: string | null
	readonly DB_PORT: number | null
	readonly DB_PORT: number | null
	readonly MIDTRANS_CLIENT_KEY: string | null
	readonly MIDTRANS_SERVER_KEY: string | null
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

declare global {
	namespace App {
		interface Locals {
			session: Session | null
		}
	}
}
