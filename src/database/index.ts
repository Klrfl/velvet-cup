import { PostgresDialect, Kysely } from "kysely"
import type { DB } from "./database.types"
import pg from "pg"
const { Pool } = pg
//
// const databaseEnvVariables = {
// 	user: import.meta.env.DB_USER,
// 	password: import.meta.env.DB_PASSWORD,
// 	database: import.meta.env.DB_DATABASE,
// 	host: import.meta.env.DB_HOST,
// 	port: import.meta.env.DB_PORT,
// }
//
// for (const [key, value] of Object.entries(databaseEnvVariables)) {
// 	if (!value || value === null) throw Error(`${key} expected to be not null`)
// }
//
const databaseUrl = import.meta.env.DATABASE_URL
if (!databaseUrl) throw Error("DATABASE_URL expected to be defined")

export const dialect = new PostgresDialect({
	pool: new Pool({ connectionString: databaseUrl }),
})

export const db = new Kysely<DB>({ dialect, log: ["error"] })
