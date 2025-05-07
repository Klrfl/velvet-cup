<script setup lang="ts">
import type { MenuCategories } from "@/database/database.types"
import type { Selectable } from "kysely"

import CategoryAdd from "@/components/CategoryAdd.vue"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog"
import { Toaster } from "@/components/ui/sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { computed, ref } from "vue"
import { z } from "astro/zod"
import { toast } from "vue-sonner"

interface Props {
	categories: Selectable<MenuCategories>[]
}

const props = defineProps<Props>()
const categories = ref(props.categories)
const categoryCount = computed(() => categories.value.length)

const selectedCategory = ref<Selectable<MenuCategories> | null>(null)
const isEditingCategory = computed(() => selectedCategory.value !== null)

function selectCategory(id: Selectable<MenuCategories>["id"]) {
	const foundCategory = categories.value.find((c) => c.id === id)
	if (!foundCategory) return

	selectedCategory.value = foundCategory
}

async function editCategory(
	form: HTMLFormElement,
	id: Selectable<MenuCategories>["id"]
) {
	if (!selectedCategory.value)
		return console.error("something wrong, display toast pls")
	const formData = new FormData(form)

	const response = await fetch(`/api/admin/categories/${id}/`, {
		method: "PUT",
		body: JSON.stringify({ name: formData.get("category-name") }),
	})
	const result = await response.json()

	const schema = z.object({
		message: z.string(),
		data: z.object({
			id: z.number(),
			name: z.string().nonempty(),
		}),
	})
	const { data: newCategory, error } = schema.safeParse(result)

	if (error) {
		return toast.error(
			`there was an error while editing ${formData.get("category-name")}.`
		)
	}

	categories.value.splice(
		categories.value.indexOf(selectedCategory.value),
		1,
		newCategory.data
	)

	toast.success("successfully edited menu category.")
	return (selectedCategory.value = null)
}

async function deleteCategory(id: number) {
	const response = await fetch(`/api/admin/categories/${id}/`, {
		method: "DELETE",
	})
	if (response.status === 500) {
		return toast.error(
			`There was an error while deleting menu category. Try refreshing the page.`
		)
	}

	categories.value = categories.value.filter((c) => c.id !== id)
	return toast.success("Successfully deleted menu category.")
}
</script>

<template>
	<p class="col-span-full">Showing {{ categoryCount }} categories.</p>

	<CategoryAdd
		class="bg-card p-6 px-4 rounded-lg col-span-full md:col-span-2"
		@category-added="(newCategory) => categories.push(newCategory)"
	/>

	<ul class="grid gap-4 col-span-full md:col-span-4 md:col-start-3">
		<li
			v-for="category in categories"
			:key="category.id"
			class="bg-card p-4 rounded-lg flex items-center gap-4"
		>
			{{ category.name }}

			<Button
				class="ml-auto"
				variant="link"
				@click="selectCategory(category.id)"
			>
				Edit
			</Button>
			<Button
				variant="ghost"
				class="outline outline-1 outline-red-400 bg-red-100"
				@click="deleteCategory(category.id)"
			>
				Delete
			</Button>
		</li>
	</ul>

	<Dialog :open="isEditingCategory" @update:open="selectedCategory = null">
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Edit category</DialogTitle>
				<DialogDescription v-if="selectedCategory" as-child>
					<p>Edit category {{ selectedCategory.name }}</p>
				</DialogDescription>
			</DialogHeader>

			<form
				v-if="selectedCategory"
				class="grid gap-4"
				@submit.prevent="
					(e) =>
						editCategory(
							e.currentTarget as HTMLFormElement,
							selectedCategory!.id
						)
				"
			>
				<Label for="category">Category name</Label>
				<Input
					id="category"
					name="category-name"
					type="text"
					:default-value="selectedCategory.name"
					placeholder="category name"
					required
				/>

				<Button type="submit" size="lg"> Edit category </Button>
			</form>
		</DialogContent>
	</Dialog>

	<Toaster rich-colors />
</template>
