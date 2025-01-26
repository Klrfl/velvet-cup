import { Pool, type PoolConfig } from "pg"
import { PostgresDialect, Kysely } from "kysely"

const databaseEnvVariables = {
	user: import.meta.env.DB_USER,
	password: import.meta.env.DB_PASSWORD,
	database: import.meta.env.DB_DATABASE,
	host: import.meta.env.DB_HOST,
	port: import.meta.env.DB_PORT,
}

for (const [key, value] of Object.entries(databaseEnvVariables)) {
	if (!value || value === null) throw Error(`${key} expected to be not null`)
}

export const dialect = new PostgresDialect({
	pool: new Pool(databaseEnvVariables as PoolConfig),
})

export const db = new Kysely({ dialect, log: ["error"] })
