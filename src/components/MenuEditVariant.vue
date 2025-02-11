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

const open = defineModel<boolean>({ required: true })

interface Props {
	variant: MenuVariants
}

defineProps<Props>()
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

			<form @submit.prevent="console.log('not implemented')">
				<label for="edit_variant_name">Name</label>
				<Input
					type="text"
					id="edit_variant_name"
					:default-value="variant.name"
					:value="variant.name"
					required
				/>

				<label for="edit_variant_price">Price</label>
				<Input
					type="number"
					id="edit_variant_price"
					:default-value="variant.price"
					:value="variant.price"
					required
				/>

				<Button type="submit">Edit variant</Button>
			</form>
		</DialogContent>
	</Dialog>
</template>
