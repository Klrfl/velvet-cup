import { createAuthClient } from "better-auth/client"
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
	plugins: [adminClient()],
	baseURL: import.meta.env.DEV ? "http://localhost:4321" : import.meta.env.SITE,
})
