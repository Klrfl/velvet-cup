import { db } from "@/database"
import { betterAuth } from "better-auth"

export const auth = betterAuth({
	emailAndPassword: { enabled: true },
	database: { db, type: "postgres" },
})
