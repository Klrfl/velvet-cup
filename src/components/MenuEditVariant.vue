<script setup lang="ts">
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog"

import type { MenuVariants } from "@/types"
import type { UpdateableMenuVariant } from "@/types"
import { ref } from "vue"

const open = defineModel<boolean>({ required: true })

interface Props {
	variant: MenuVariants
	menuId: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
	(e: "variantEdited", newVariant: UpdateableMenuVariant): void
}>()

const newVariant = ref({
	name: props.variant.name,
	price: props.variant.price,
})

async function handleEditVariant(variant: UpdateableMenuVariant) {
	const response = await fetch(
		`/api/admin/menu/${props.menuId}/variants/${props.variant.id}`,
		{
			method: "PUT",
			body: JSON.stringify(variant),
		}
	)

	if (response.status === 200) {
		emit("variantEdited", variant)
		open.value = false
	}
}
</script>

<template>
	<Dialog :open="open" @update:open="open = false">
		<DialogContent>
			<DialogTitle as-child>
				<h2>Edit variant {{ variant.name }}</h2>
			</DialogTitle>

			<DialogDescription as-child>
				<p>Edit variant to change name, prices and more</p>
			</DialogDescription>

			<form @submit.prevent="handleEditVariant(newVariant)">
				<label for="edit_variant_name">Name</label>
				<Input
					type="text"
					id="edit_variant_name"
					v-model="newVariant.name"
					required
				/>

				<label for="edit_variant_price">Price</label>
				<Input
					type="number"
					id="edit_variant_price"
					v-model="newVariant.price"
					required
				/>

				<Button type="submit">Edit variant</Button>
			</form>
		</DialogContent>
	</Dialog>
</template>
