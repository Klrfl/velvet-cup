<script setup lang="ts">
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select"

import { ref, useTemplateRef, watch } from "vue"
import type { menuAdminReturnType } from "@/database/queries"

interface Props {
	options: menuAdminReturnType[0]["options"]
}

const { options } = defineProps<Props>()
const emit = defineEmits(["variantAdded"])

const price = ref(0)

const priceInput = useTemplateRef("price-input")

watch(
	() => priceInput.value?.modelValue ?? 0,
	async (newPrice, oldPrice) => {
		const castedPrice = Number(newPrice)
		const castedOldPrice = Number(oldPrice)

		if (isNaN(castedPrice)) {
			price.value = isNaN(castedOldPrice) ? 0 : castedOldPrice
		}
	}
)
</script>

<template>
	<form
		class="grid gap-4"
		@submit.prevent="
			(e) => emit('variantAdded', e.currentTarget as HTMLFormElement)
		"
	>
		<fieldset>
			<Label for="name">Variant name</Label>
			<Input
				id="name"
				type="text"
				name="name"
				placeholder="Variant name"
				required
			/>
		</fieldset>

		<fieldset>
			<Label for="price">Price</Label>
			<Input
				id="price"
				ref="price-input"
				v-model="price"
				pattern="[0-9]+"
				type="text"
				inputmode="numeric"
				name="price"
				placeholder="price"
			/>
		</fieldset>

		<fieldset v-for="option in options" :key="option.id">
			<Label>{{ option.name }}</Label>

			<Select :id="option.name" :name="option.name">
				<SelectTrigger>
					<SelectValue :placeholder="`select a ${option.name}`" />
				</SelectTrigger>

				<SelectContent>
					<SelectItem
						v-for="option_value in option.option_values"
						:key="option_value.id"
						:value="String(option_value.id)"
					>
						{{ option_value.name }}
					</SelectItem>
				</SelectContent>
			</Select>
		</fieldset>

		<Button type="submit">Add new Variant</Button>
	</form>
</template>
