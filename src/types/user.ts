import type { User as DBUser } from "@/database/database.types"
import type { Selectable } from "kysely"

export type User = Selectable<DBUser>
