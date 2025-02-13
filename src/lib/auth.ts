import { db } from "@/database"
import { betterAuth } from "better-auth"
import { admin } from "better-auth/plugins"

export const auth = betterAuth({
	emailAndPassword: { enabled: true },
	plugins: [admin()],
	database: { db, type: "postgres" },
	trustedOrigins: [
		import.meta.env.DEV ? "http://localhost:4321" : import.meta.env.SITE,
	],
})
