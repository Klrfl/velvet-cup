import { db } from "@/database"
import { betterAuth } from "better-auth"

export const auth = betterAuth({
	emailAndPassword: { enabled: true },
	database: { db, type: "postgres" },
	trustedOrigins: [
		import.meta.env.DEV ? "http://localhost:4321" : import.meta.env.SITE,
	],
})
