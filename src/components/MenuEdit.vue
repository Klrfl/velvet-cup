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
import MenuAddVariant from "@/components/MenuAddVariant.vue"

import { ref } from "vue"
import type { MenuComplete, MenuVariants } from "@/types"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "vue-sonner"

interface Props {
	menu: MenuComplete
	variants: MenuVariants[]
	categories: {
		id: number
		name: string
	}[]
}

const props = defineProps<Props>()

const categories = ref(props.categories)
const menu = ref(props.menu)
const variants = ref(props.variants)

async function handleEditMenu(e: Event, id: number) {
	const form = e.currentTarget as HTMLFormElement
	const formData = new FormData(form)

	const res = await fetch(`/api/admin/menu/${id}`, {
		method: "PUT",
		body: formData,
	})

	if (res.status === 200) {
		toast.success("Successfully edited menu item")
	}
}

const newOptions = ref([])

const isOptionDialogOpen = ref(false)

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

	const response = await fetch(`/api/admin/menu/${menu.value.id}/options`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	})

	const result = await response.json()
	console.log(result.data)

	menu.value.options.push(result.data)
	// TODO: handle errors when adding new option

	isOptionDialogOpen.value = false
	toast.success("successfully added a new option.")
}

async function handleAddVariant(form: HTMLFormElement) {
	const formData = new FormData(form)

	let body: Record<string, any> = {}

	for (const [key, value] of formData) {
		// if current key is not name or price
		// or in other words, if current key is the options
		if (!["name", "price"].includes(key)) {
			if (!Object.hasOwn(body, "options")) {
				body["options"] = []
			}

			body["options"].push({
				option_value_id: value,
			})
		} else {
			body[key] = value
		}
	}

	const response = await fetch(`/api/admin/menu/${menu.value.id}/variants`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	})

	const result = await response.json()

	variants.value.push(result.data)
}
</script>

<template>
	<form class="grid gap-4" @submit.prevent="(e) => handleEditMenu(e, menu.id)">
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
			:default-value="menu.description"
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

		<Button type="submit" class="justify-self-start">Sunting</Button>
	</form>

	<h2 class="font-bold text-xl font-sans">Options</h2>
	<Dialog :open="isOptionDialogOpen">
		<DialogTrigger as-child>
			<Button @click="isOptionDialogOpen = true">Add new option</Button>
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
		<h2 class="col-span-full text-xl font-bold font-sans">variants</h2>

		<ul class="col-span-full">
			<li v-if="!variants.length">No variants yet.</li>
			<li v-for="variant in variants">
				{{ variant.name }} - <span class="font-bold">{{ variant.price }}</span>

				<div v-for="variant_option in variant.options">
					{{ variant_option.name }}
				</div>
			</li>
		</ul>

		<Dialog>
			<DialogTrigger as-child>
				<Button type="button" class="col-span-full" variant="outline">
					Add new variant
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogTitle>
					<h2 class="text-xl">Add new Variant</h2>
				</DialogTitle>
				<DialogDescription>
					Add a new variant for {{ menu.name }}.
				</DialogDescription>

				<MenuAddVariant
					@variant-added="(form) => handleAddVariant(form as HTMLFormElement)"
					:options="menu.options"
				/>
			</DialogContent>
		</Dialog>
	</div>

	<Toaster rich-colors />
</template>
