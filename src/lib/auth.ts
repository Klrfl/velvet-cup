import { db } from "@/database"
import { betterAuth } from "better-auth"

export const auth = betterAuth({
	database: { db, type: "postgres" },
})
