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
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog"
import { Pencil, Plus } from "lucide-vue-next"

import MenuVariantItem from "@/components/MenuVariant.vue"
import MenuAddVariant from "@/components/MenuAddVariant.vue"
import MenuEditVariant from "@/components/MenuEditVariant.vue"
import MenuOption from "@/components/MenuOption.vue"
import MenuEditOption from "@/components/MenuEditOption.vue"

import { ref } from "vue"
import type { MenuVariant } from "@/types"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "vue-sonner"
import { usePreviewImage } from "@/composables"
import type { AdminMenuReturnType } from "@/database/queries"

interface Props {
	menu: AdminMenuReturnType[0]
	variants: MenuVariant[]
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

const newOptions = ref<string[]>([])

const isOptionDialogOpen = ref(false)

async function handleAddOption(form: HTMLFormElement) {
	const formData = new FormData(form)

	const body: Record<string, any> = {}

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

	const { data } = await response.json()

	menu.value.options.push(data)
	// TODO: handle errors when adding new option

	toast.success("successfully added a new option.")
	isOptionDialogOpen.value = false
}

const isEditOptionDialogOpen = ref(false)
const activeOption = ref<AdminMenuReturnType[0]["options"][0]>()

function handleEditOption(option: AdminMenuReturnType[0]["options"][0]) {
	isEditOptionDialogOpen.value = true
	activeOption.value = option
}

const isVariantDialogOpen = ref(false)
async function handleAddVariant(form: HTMLFormElement) {
	const formData = new FormData(form)

	const body: Record<string, any> = {}

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

	const { data } = await response.json()
	variants.value.push(data)

	toast.success("successfully added a new variant.")
	isVariantDialogOpen.value = false
}

const isEditVariantOpen = ref(false)
const activeVariant = ref<MenuVariant>()

function handleEditVariant(variant: MenuVariant) {
	activeVariant.value = variant
	isEditVariantOpen.value = true
}

const { previewURL, previewImage, newImage } = usePreviewImage()
</script>

<template>
	<figure
		:class="[
			'col-span-full md:col-span-3 grid items-center',
			{ 'outline-dashed outline-primary-300 text-center': !previewURL },
		]"
	>
		<span v-if="!newImage && !menu.image">
			Your image preview will show up here.
		</span>

		<img
			v-else
			:src="
				previewURL === ''
					? (menu.image ?? '/Image_not_available.png')
					: previewURL
			"
			class="object-cover aspect-video w-full"
			alt=""
		/>
	</figure>

	<form
		class="flex flex-col gap-2 col-span-full md:col-span-3"
		enctype="multipart/form-data"
		@submit.prevent="(e) => handleEditMenu(e, menu.id)"
	>
		<Label for="menu_name">Name</Label>
		<Input
			id="menu_name"
			v-model:model-value="menu.name as string"
			type="text"
			placeholder="nama"
			name="menu_name"
			required
		/>

		<Label for="menu_image">Image</Label
		><Input
			id="menu_image"
			type="file"
			name="menu_image"
			accept="image/*"
			@change="(e: Event) => previewImage(e.currentTarget as HTMLFormElement)"
		/>

		<Label for="menu_description">Description</Label>
		<Textarea
			id="menu_description"
			v-model:model-value="menu.description as string"
			placeholder="deskripsi"
			name="menu_description"
			:default-value="menu.description ?? ''"
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
				<SelectItem
					v-for="category in categories"
					:key="category.id"
					:value="String(category.id)"
				>
					{{ category.name }}
				</SelectItem>
			</SelectContent>
		</Select>

		<Button type="submit" class="justify-self-start">
			<Pencil fill="white" />
			Edit
		</Button>
	</form>

	<div class="col-span-full md:col-span-3 gap-4">
		<header class="flex justify-between">
			<h2 class="font-bold text-xl font-sans">Options</h2>

			<Button @click="isOptionDialogOpen = true">
				<Plus fill="white" />
				Add new option
			</Button>
		</header>

		<ul class="py-4">
			<MenuOption
				v-for="option in menu.options"
				:key="option.id"
				:option="option"
				@trigger-option-edit="(option) => handleEditOption(option)"
			/>
		</ul>
	</div>

	<Dialog :open="isOptionDialogOpen" @update:open="isOptionDialogOpen = false">
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
					id="new_variant"
					type="text"
					name="new_variant"
					placeholder="variant name"
					required
				/>

				<Label for="new_variant_values">Variant values, comma separated</Label>

				<TagsInput
					id="new_variant_values"
					v-model="newOptions"
					name="new_variant_values"
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

				<Button type="submit"> Add new option </Button>
			</form>
		</DialogContent>
	</Dialog>

	<MenuEditOption
		v-if="activeOption"
		v-model="isEditOptionDialogOpen"
		:menu-id="menu.id"
		:option="activeOption"
		@option-edited="
			() => {
				toast.success('Successfully edited option.')
				isEditOptionDialogOpen = false
			}
		"
	/>

	<div class="col-span-full md:col-span-3 gap-4">
		<header class="flex justify-between">
			<h2 class="text-xl font-bold font-sans">Variants</h2>
			<Button @click="isVariantDialogOpen = true">
				<Plus fill="white" />
				Add new variant
			</Button>
		</header>

		<ul class="col-span-full flex flex-col gap-4 py-4">
			<li v-if="!variants.length">No variants yet.</li>

			<MenuVariantItem
				v-for="variant in variants"
				:key="variant.id"
				:variant="variant"
				@trigger-variant-edit="(variant) => handleEditVariant(variant)"
			/>
		</ul>
	</div>

	<Dialog
		:open="isVariantDialogOpen"
		@update:open="isVariantDialogOpen = false"
	>
		<DialogContent>
			<DialogTitle>
				<h2 class="text-xl">Add new Variant</h2>
			</DialogTitle>
			<DialogDescription>
				Add a new variant for {{ menu.name }}.
			</DialogDescription>

			<MenuAddVariant
				:options="menu.options"
				@variant-added="(form) => handleAddVariant(form as HTMLFormElement)"
			/>
		</DialogContent>
	</Dialog>

	<MenuEditVariant
		v-if="activeVariant"
		v-model="isEditVariantOpen"
		:variant="activeVariant"
		:menu-id="menu.id"
		@variant-edited="toast.success('successfully edited menu variant.')"
	/>

	<Toaster rich-colors />
</template>
