import MenuServiceImpl from "@/lib/services/menu"
import type { APIRoute } from "astro"
import { z } from "astro:content"

export const POST: APIRoute = async ({ request }) => {
	const formData = await request.formData()

	const name = formData.get("menu_name")
	const description = formData.get("menu_description")
	const category_id = formData.get("menu_category")
	const image = formData.get("menu_image")

	const inputSchema = z.object({
		name: z.string(),
		description: z.string(),
		category_id: z.number(),
		image: z.instanceof(File).optional(),
	})

	let inputMenu
	try {
		inputMenu = inputSchema.parse({
			name,
			description,
			category_id: Number(category_id),
			image,
		})
	} catch (error) {
		console.error(error)

		return new Response(
			JSON.stringify({ message: "body malformed", error, body: inputMenu }),
			{ status: 400 }
		)
	}

	/** TODO:
	 * figure out an architecture solution for
	 * adding a separate but tightly coupled resource
	 * for example, an image to a menu
	 * */
	if (inputMenu.image) {
		const imageBuf = await inputMenu.image.arrayBuffer()
		let encodedImage = Buffer.from(imageBuf).toString("base64")
		encodedImage = `data:${request.headers.get("content-type")};charset=utf-8;base64,${encodedImage}`

		inputMenu = { ...inputMenu, image: encodedImage }
	} else {
		inputMenu = { ...inputMenu, image: null }
	}

	const menuService = new MenuServiceImpl()
	try {
		const menu = await menuService.addMenu(inputMenu)

		return new Response(
			JSON.stringify({
				message: "added a new menu successfully.",
				data: menu,
			})
		)
	} catch (error) {
		console.error(error)

		return new Response(
			JSON.stringify({
				message: "there was an error adding a new menu.",
			}),
			{ status: 500 }
		)
	}
}
