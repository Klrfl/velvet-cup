<script setup lang="ts">
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select"
import { Toaster } from "@/components/ui/sonner"
import type { Selectable } from "kysely"
import type { MenuCategories } from "@/database/database.types"
import { usePreviewImage } from "@/composables"
import { toast } from "vue-sonner"
import { useFetch } from "@vueuse/core"
import { encodeImageToBase64 } from "@/lib/utils"

const { previewImage, previewURL, newImage } = usePreviewImage()

const MAX_FILE_SIZE = 250 * 1000 // 250 kb

async function handleAddMenu(form: HTMLFormElement) {
	const formData = new FormData(form)

	const rawImage = formData.get("image") as File

	const fileSize = rawImage.size
	if (fileSize > MAX_FILE_SIZE) {
		return toast.error("image is too big, please select a smaller image")
	}

	const encoded = await encodeImageToBase64(rawImage)

	const body = {
		...Object.fromEntries(formData.entries()),
		image: encoded,
	}

	const { data, error } = await useFetch(`/api/admin/menu/`).post(body).json()

	if (error.value) {
		return toast.error("failed to add new menu.")
	}

	const menu = data.value.data
	window.location.assign(`/admin/menu/${menu.id}`)
}

interface Props {
	categories: Selectable<MenuCategories>[]
}

const { categories } = defineProps<Props>()
</script>

<template>
	<div class="grid md:grid-cols-6 auto-rows-fr gap-4">
		<figure
			:class="[
				'col-span-full md:col-span-3 grid items-center',
				{ 'outline-dashed outline-primary-300 text-center': !previewURL },
			]"
		>
			<span v-if="!newImage"> Your image preview will show up here. </span>
			<img
				v-else
				:src="previewURL"
				alt=""
				width="800"
				height="450"
				class="object-cover aspect-video w-full"
			/>
		</figure>

		<form
			class="flex flex-col col-span-full md:col-span-3 gap-2"
			enctype="multipart/form-data"
			@submit.prevent="(e) => handleAddMenu(e.currentTarget as HTMLFormElement)"
		>
			<Label for="image">Image (max {{ MAX_FILE_SIZE / 1000 }} KB)</Label>
			<Input
				id="image"
				type="file"
				name="image"
				accept="image/*"
				@change="(e: Event) => previewImage(e.currentTarget as HTMLFormElement)"
			/>

			<Label for="name">Name</Label>
			<Input type="text" name="name" placeholder="nama" required />

			<Label for="description">Deskripsi</Label>
			<Textarea placeholder="deskripsi" name="description" required></Textarea>

			<Label for="category">Category</Label>

			<Select id="category" name="category_id">
				<SelectTrigger>
					<SelectValue placeholder="select a category" />
				</SelectTrigger>

				<SelectContent>
					<SelectItem
						v-for="category in categories"
						:key="category.id"
						:value="String(category.id)"
					>
						{{ category.name }}
					</SelectItem>
				</SelectContent>
			</Select>

			<Button type="submit">tambahkan menu baru</Button>
		</form>
	</div>

	<Toaster :rich-colors="true" />
</template>
