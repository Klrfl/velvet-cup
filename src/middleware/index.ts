import { auth } from "@/lib/auth"
import { defineMiddleware } from "astro:middleware"

export const onRequest = defineMiddleware(
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
