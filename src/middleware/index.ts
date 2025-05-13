import { auth } from "@/lib/auth"
import { defineMiddleware, sequence } from "astro:middleware"

const adminMiddleware = defineMiddleware(
	async ({ request, redirect, url }, next) => {
		const isGoingToAdmin = url.pathname.includes("/admin")
		const session = await auth.api.getSession({ headers: request.headers })
		const isAdmin = session && session.user.role === "admin"

		if (isGoingToAdmin && !isAdmin) {
			return redirect("/", 308)
		}

		return next()
	}
)

/**
 * middleware for both authenticated and anon routes.
 * TODO: pass user_id in middleware to minimize calls auth.api
 * */
const authMiddleware = defineMiddleware(
	async ({ request, redirect, url }, next) => {
		const session = await auth.api.getSession({ headers: request.headers })

		// if not authenticated
		if (!session) {
			if (url.pathname.includes("/account")) {
				return redirect("/")
			}
		}

		// if authenticated
		if (session) {
			if (url.pathname.includes("/login")) {
				return redirect("/")
			}
		}

		return next()
	}
)

export const onRequest = sequence(adminMiddleware, authMiddleware)
