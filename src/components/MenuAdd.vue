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
import { ref } from "vue"
import type { Selectable } from "kysely"
import type { MenuCategories } from "@/database/database.types"

const emit = defineEmits(["menuAdded"])

async function handleAddMenu(form: HTMLFormElement) {
	const formData = new FormData(form)

	const res = await fetch(`/api/admin/menu/`, {
		method: "POST",
		body: formData,
	})

	const { message, data } = await res.json()

	if (res.status === 200) {
		// TODO: do something
		emit("menuAdded", data)
	}
}

interface Props {
	categories: Selectable<MenuCategories>[]
}

const props = defineProps<Props>()
const categories = ref(props.categories)
const newCategory = ref("")

async function handleAddCategory(category: string) {
	const response = await fetch("/api/admin/categories", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name: category }),
	})

	const { data } = await response.json()

	//TODO: alert or do something to handle error
	if (response.status !== 200) {
		return console.error(response)
	}

	categories.value.push(data)
}
</script>

<template>
	<form
		@submit.prevent="(e) => handleAddMenu(e.currentTarget as HTMLFormElement)"
		class="grid gap-2 max-w-xl"
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
				<SelectItem v-for="category in categories" :value="String(category.id)">
					{{ category.name }}
				</SelectItem>
			</SelectContent>
		</Select>

		<Label for="new_category">Add new category</Label>
		<Input type="text" v-model:model-value="newCategory" id="new_category" />
		<Button
			@click="handleAddCategory(newCategory)"
			type="button"
			variant="outline"
		>
			Add new category
		</Button>

		<Button type="submit">tambahkan menu baru</Button>
	</form>
</template>
