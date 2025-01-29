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

import type { Menu, MenuCategories } from "@/database/database.types"
import type { Selectable } from "kysely"

interface Props {
	menu: Selectable<Menu>
	categories: MenuCategories[]
}

const { categories } = defineProps<Props>()

async function handleEditMenu(e: Event, id: number) {
	const form = e.currentTarget as HTMLFormElement
	const formData = new FormData(form)

	const res = await fetch(`/api/admin/menu/${id}`, {
		method: "PUT",
		body: formData,
	})

	if (res.status === 200) {
		console.log("success")
	}
}
</script>

<template>
	<form @submit.prevent="(e) => handleEditMenu(e, menu.id)">
		<Label for="menu_name">Name</Label>
		<Input
			type="text"
			placeholder="nama"
			v-model:model-value="menu.name as string"
			name="menu_name"
			id="menu_name"
			required
		/>

		<Label for="menu_description">Description</Label>
		<Textarea
			placeholder="deskripsi"
			name="menu_description"
			id="menu_description"
			v-model:model-value="menu.description as string"
			required
		>
		</Textarea>

		<Label for="menu_category">Category</Label>

		<Select id="menu_category" name="menu_category">
			<SelectTrigger>
				<SelectValue placeholder="select a category" />
			</SelectTrigger>

			<SelectContent>
				<SelectItem v-for="category in categories" :value="String(category.id)">
					{{ category.name }}
				</SelectItem>
			</SelectContent>
		</Select>

		<Button type="submit">Sunting</Button>
	</form>
</template>
