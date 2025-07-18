<script setup lang="ts">
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	TagsInput,
	TagsInputItem,
	TagsInputItemText,
	TagsInputInput,
} from "@/components/ui/tags-input"
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import type { MenuComplete } from "@/types"
import { ref } from "vue"
import type { AdminMenuReturnType } from "@/lib/services/menu"

const open = defineModel<boolean>({ required: true })

interface Props {
	menuId: MenuComplete["id"]
	option: AdminMenuReturnType[0]["options"][0]
}

const props = defineProps<Props>()
const derivedOption = ref(props.option)

const emit = defineEmits<{
	(e: "optionEdited"): void
}>()

async function handleEditOption(
	menuId: MenuComplete["id"],
	option: AdminMenuReturnType[0]["options"][0]
) {
	const response = await fetch(
		`/api/admin/menu/${menuId}/options/${option.id}`,
		{
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(option),
		}
	)

	if (response.status === 200) {
		emit("optionEdited")
	}
}
</script>

<template>
	<Dialog :open="open" @update:open="open = false">
		<DialogContent>
			<DialogTitle><h1>Edit option</h1></DialogTitle>
			<DialogDescription>
				<p>Edit option name and values</p>
			</DialogDescription>

			<form
				class="flex flex-col gap-4"
				@submit.prevent="handleEditOption(menuId, derivedOption)"
			>
				<Label for="option">Variant name</Label>
				<Input
					id="option"
					v-model="derivedOption.name"
					type="text"
					:default-value="option.name"
					name="option"
					placeholder="option name"
					required
				/>

				<Label for="option_values">Variant values, comma separated</Label>

				<!-- {{ derivedOption.option_values }} -->
				<TagsInput
					id="option_values"
					v-model="derivedOption.option_values"
					:convert-value="(name) => ({ name, menu_option_id: option.id })"
					name="option_values"
					disabled
				>
					<TagsInputItem
						v-for="option_value in derivedOption.option_values"
						:key="String(option_value.id)"
						:value="String(option_value.name)"
					>
						<TagsInputItemText />
					</TagsInputItem>

					<TagsInputInput placeholder="L, Spicy, dll..." />
				</TagsInput>

				<Button type="submit">Edit option</Button>
			</form>
		</DialogContent>
	</Dialog>
</template>
