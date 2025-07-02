/// <reference types="astro/client" />

import type { Session } from "@/lib/auth"

interface ImportMetaEnv {
	readonly DATABASE_URL: string | null
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
