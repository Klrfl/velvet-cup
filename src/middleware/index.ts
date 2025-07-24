import { auth } from "@/lib/auth"
import { defineMiddleware, sequence } from "astro:middleware"
import match from "picomatch"

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

const protectedRoutes = ["/account/**", "/api/**", "/basket/*"]

/**
 * middleware for both authenticated and anon routes.
 * TODO: pass user_id in middleware to minimize calls auth.api
 * */
const authMiddleware = defineMiddleware(
	async ({ locals, request, redirect, url }, next) => {
		const session = await auth.api.getSession({ headers: request.headers })
		locals.session = session

		// if not authenticated
		if (!session) {
			// user is trying to authenticate
			if (match.isMatch(url.pathname, "/api/auth/**")) return next()

			if (match.isMatch(url.pathname, protectedRoutes)) {
				return redirect("/login")
			}
		}

		// if authenticated
		if (session && url.pathname.includes("/login")) {
			return redirect("/")
		}

		return next()
	}
)

const corsMiddleware = defineMiddleware(async (_, next) => {
	const response = await next()

	response.headers.set(
		"Access-Control-Allow-Origin",
		import.meta.env.DEV ? "*" : import.meta.env.SITE
	)
	response.headers.set(
		"Access-Control-Allow-Headers",
		"Origin, Content-Type, Accept, X-TIMESTAMP"
	)
	response.headers.set("Access-Control-Allow-Credentials", "true")
	response.headers.set(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, OPTIONS"
	)

	return response
})

export const onRequest = sequence(
	corsMiddleware,
	adminMiddleware,
	authMiddleware
)
