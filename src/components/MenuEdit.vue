<script setup lang="ts">
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import type { Menu } from "@/database/database.types"
import type { Selectable } from "kysely"

interface Props {
	menu: Selectable<Menu>
}

defineProps<Props>()

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
</script>

<template>
	<form @submit.prevent="(e) => handleEditMenu(e, menu.id)">
		<Label for="menu_name">Nama</Label>
		<Input
			type="text"
			placeholder="nama"
			v-model:model-value="menu.name as string"
			name="menu_name"
			id="menu_name"
			required
		/>

		<Label for="menu_description">Deskripsi</Label>
		<Textarea
			placeholder="deskripsi"
			name="menu_description"
			id="menu_description"
			v-model:model-value="menu.description as string"
			required
		>
		</Textarea>

		<Button type="submit">Sunting</Button>
	</form>
</template>
