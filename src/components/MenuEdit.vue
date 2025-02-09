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
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog"

import { ref } from "vue"
import type { MenuWithCategories } from "@/types"

interface Props {
	menu: MenuWithCategories
	categories: {
		id: number
		name: string
	}[]
}

const { menu, categories } = defineProps<Props>()

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

const newOptions = ref([])
const menuOptions = ref([])

async function handleAddOption(form: HTMLFormElement) {
	const formData = new FormData(form)

	let body: Record<string, any> = {}

	/** initially the input where we got the values from 
   spits out a flat formData we transform it into an
   object so we can insert it on the backend more easily
   like so
  */

	for (const [key, value] of formData) {
		if (key.startsWith("[new_variant_values]")) {
			if (!Object.hasOwn(body, "values")) {
				body["values"] = []
			}

			body["values"].push({ name: value })
			continue
		} else if (key === "new_variant") body["name"] = value as string
	}

	const response = await fetch(`/api/admin/menu/${menu.id}/options`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	})

	const result = await response.json()
	console.log(result)

	menuOptions.value = menuOptions.value.push(result.data)
	// TODO: handle errors when adding new option
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

		<Select
			id="menu_category"
			name="menu_category"
			:default-value="String(menu.category_id)"
		>
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

	<h2 class="font-bold text-xl font-sans">Options</h2>
	<Dialog>
		<DialogTrigger as-child>
			<Button>Add new option</Button>
		</DialogTrigger>

		<DialogContent>
			<DialogHeader>
				<DialogTitle>Add new option</DialogTitle>
				<DialogDescription> Add new option and values. </DialogDescription>
			</DialogHeader>

			<form
				class="flex flex-col gap-4"
				@submit.prevent="
					(e) => handleAddOption(e.currentTarget as HTMLFormElement)
				"
			>
				<Label for="new_variant">Variant name</Label>
				<Input
					type="text"
					name="new_variant"
					id="new_variant"
					placeholder="variant name"
					required
				/>

				<Label for="new_variant_values">Variant values, comma separated</Label>

				<TagsInput
					v-model="newOptions"
					name="new_variant_values"
					id="new_variant_values"
				>
					<TagsInputItem
						v-for="option in newOptions"
						:key="option"
						:value="option"
					>
						<TagsInputItemText />
						<TagsInputItemDelete />
					</TagsInputItem>

					<TagsInputInput placeholder="L, Spicy, dll..." />
				</TagsInput>

				<Button type="submit">Add new variant</Button>
			</form>
		</DialogContent>
	</Dialog>

	<ul>
		<li
			v-for="option in menu.options"
			:key="option.id"
			class="flex items-center"
		>
			<span class="font-bold">
				{{ option.name }}
			</span>

			<ul class="flex gap-4">
				<li
					v-for="option_value in option.option_values"
					:key="option_value.id"
					class="px-4 py-2"
				>
					{{ option_value.name }}
				</li>
			</ul>
		</li>
	</ul>

	<div class="grid grid-cols-8 gap-4 items-end">
		<h2 class="text-xl font-bold font-sans">Add new variants</h2>
		<div class="col-span-3">
			<Label for="menu_option_name">Variant title</Label>
			<Input
				type="text"
				id="menu_option_name"
				placeholder="option name"
				required
			/>
		</div>

		<div class="col-span-4">
			<Label for="menu_variation_options">Variant values</Label>

			<!-- TODO: only active shown when variant value is already picked  -->

			<Select id="menu_variant_values" name="menu_variant_values" disabled>
				<SelectTrigger>
					<SelectValue placeholder="select a value" />
				</SelectTrigger>

				<SelectContent>
					<SelectItem
						v-for="value in ['not', 'implemented']"
						:value="String(value)"
					>
						{{ value }}
					</SelectItem>
				</SelectContent>
			</Select>
		</div>

		<Button
			type="button"
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
</template>
