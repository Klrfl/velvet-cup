import { createAuthClient } from "better-auth/client"

export const authClient = createAuthClient({
	baseURL: import.meta.env.DEV ? "http://localhost:4321" : import.meta.env.SITE,
})
