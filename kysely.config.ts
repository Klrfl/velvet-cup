import { defineConfig } from "kysely-ctl"
import { db as kysely } from "./src/database/"

export default defineConfig({
	kysely,
	migrations: {
		migrationFolder: "./src/database/migrations/",
	},
	seeds: {
		seedFolder: "./src/database/seeds/",
	},
})
