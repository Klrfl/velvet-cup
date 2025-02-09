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

import type { MenuComplete } from "@/types"

interface Props {
	options: MenuComplete["options"]
}

const { options } = defineProps<Props>()
const emit = defineEmits(["variantAdded"])
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
				type="text"
				id="name"
				name="name"
				placeholder="Variant name"
				required
			/>
		</fieldset>

		<fieldset>
			<Label for="price">Price</Label>
			<Input
				type="number"
				inputmode="number"
				id="price"
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
