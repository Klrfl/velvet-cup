<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { MenuCategories } from "@/database/database.types"
import type { Selectable } from "kysely"
import { toast } from "vue-sonner"

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

	if (response.status !== 200) {
		console.error(response)
		return toast.error("There was something wrong when adding category.")
	}

	emit("categoryAdded", data)
	newCategory.value = ""
}
</script>

<template>
	<!-- don't add the toaster component because there's already one in CategoryList -->
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
