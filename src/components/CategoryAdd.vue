<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { MenuCategories } from "@/database/database.types"
import type { Selectable } from "kysely"

import { ref } from "vue"

const emit = defineEmits<{
	(e: "categoryAdded", payload: Selectable<MenuCategories>): void
}>()
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

	emit("categoryAdded", data)
	newCategory.value = ""
}
</script>

<template>
	<form class="grid gap-4" @submit.prevent="handleAddCategory(newCategory)">
		<label for="new_category">Add new category</label>
		<Input
			id="new_category"
			v-model:model-value="newCategory"
			type="text"
			required
			placeholder="new category name..."
		/>
		<Button type="submit"> Add new category </Button>
	</form>
</template>
