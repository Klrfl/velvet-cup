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
import {
	TagsInput,
	TagsInputItem,
	TagsInputInput,
	TagsInputItemText,
	TagsInputItemDelete,
} from "@/components/ui/tags-input"

import type { Menu } from "@/database/database.types"
import type { Selectable } from "kysely"
import { ref } from "vue"

interface Props {
	menu: Selectable<Menu>
	categories: {
		id: number
		name: string
	}[]
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

const variantOptions = ref(["apa", "kek"])

async function handleAddOption() {
	const response = await fetch("/api/admin/menu/variants", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(variantOptions),
	})

	const result = await response.json()
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

		<h2 class="font-bold text-xl font-sans">Variants</h2>

		<div class="grid grid-cols-8 gap-4 items-end">
			<div class="col-span-3">
				<Label for="menu_option_name">Option title</Label>
				<Input
					type="text"
					id="menu_option_name"
					placeholder="option name"
					required
				/>
			</div>

			<div class="col-span-4">
				<Label for="menu_variation_options">Variant values</Label>

				<TagsInput v-model="variantOptions" id="menu_variant_options">
					<TagsInputItem
						v-for="option in variantOptions"
						:key="option"
						:value="option"
					>
						<TagsInputItemText />
						<TagsInputItemDelete />
					</TagsInputItem>

					<TagsInputInput placeholder="L, Spicy, dll..." />
				</TagsInput>
			</div>

			<Button
				class="col-span-1 text-destructive outline outline-1 outline-destructive"
				variant="ghost"
			>
				Delete variant
			</Button>

			<div class="col-span-3">
				<Label for="menu_price">Price</Label>
				<Input
					type="number"
					id="menu_price"
					name="menu_price"
					placeholder="type price here"
				/>
			</div>

			<Button
				class="col-span-full"
				type="button"
				variant="outline"
				@click="handleAddOption"
			>
				add a new variant
			</Button>
		</div>

		<Button type="submit">Sunting</Button>
	</form>
</template>
