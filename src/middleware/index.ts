import { auth } from "@/lib/auth"
import { defineMiddleware, sequence } from "astro:middleware"

const adminMiddleware = defineMiddleware(
	async ({ request, redirect }, next) => {
		const isGoingToAdmin = request.url.includes("/admin")
		const session = await auth.api.getSession({ headers: request.headers })
		const isAdmin = session?.user.role === "admin"

		if ((!session || !isAdmin) && isGoingToAdmin) {
			return redirect("/", 308)
		}

		return next()
	}
)

/**
 * middleware for both authenticated and anon routes.
 * */
const authMiddleware = defineMiddleware(
	async ({ request, redirect, url }, next) => {
		const session = await auth.api.getSession({ headers: request.headers })

		// if not authenticated
		if (!session) {
			if (["/account"].includes(url.pathname)) {
				return redirect("/")
			}
		}

		// if authenticated
		if (session) {
			if (["/login"].includes(url.pathname)) {
				return redirect("/")
			}
		}

		return next()
	}
)

export const onRequest = sequence(adminMiddleware, authMiddleware)
