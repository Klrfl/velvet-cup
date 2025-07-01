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

const { previewImage, previewURL, newImage } = usePreviewImage()

async function handleAddMenu(form: HTMLFormElement) {
	const formData = new FormData(form)
	const headers = new Headers()
	headers.set("X-TIMESTAMP", new Date().getTime().toString())

	const res = await fetch(`/api/admin/menu/`, {
		method: "POST",
		mode: "same-origin",
		headers,
		body: formData,
	})

	const { data: menu } = await res.json()

	if (res.status !== 200) {
		return toast.error("failed to add new menu.")
	}

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
			<Label for="menu_image">Image</Label>
			<Input
				id="menu_image"
				type="file"
				name="menu_image"
				accept="image/*"
				@change="(e: Event) => previewImage(e.currentTarget as HTMLFormElement)"
			/>

			<Label for="menu_name">Name</Label>
			<Input type="text" name="menu_name" placeholder="nama" required />

			<Label for="menu_description">Deskripsi</Label>
			<Textarea
				placeholder="deskripsi"
				name="menu_description"
				required
			></Textarea>

			<Label for="menu_category">Category</Label>

			<Select id="menu_category" name="menu_category">
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
