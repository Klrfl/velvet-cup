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
import type { Selectable } from "kysely"
import type { MenuCategories } from "@/database/database.types"

const emit = defineEmits(["menuAdded"])

async function handleAddMenu(form: HTMLFormElement) {
	const formData = new FormData(form)

	const res = await fetch(`/api/admin/menu/`, {
		method: "POST",
		body: formData,
	})

	const { message, data: menu } = await res.json()

	if (res.status === 200) {
		window.location.assign(`/admin/menu/${menu.id}`)
	}
}

interface Props {
	categories: Selectable<MenuCategories>[]
}

const { categories } = defineProps<Props>()
</script>

<template>
	<div class="flex flex-wrap gap-4">
		<form
			@submit.prevent="(e) => handleAddMenu(e.currentTarget as HTMLFormElement)"
			class="flex flex-col flex-grow-[6] gap-2"
		>
			<Label for="menu_name">Nama</Label>
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
						:value="String(category.id)"
					>
						{{ category.name }}
					</SelectItem>
				</SelectContent>
			</Select>

			<Button type="submit">tambahkan menu baru</Button>
		</form>
	</div>
</template>
