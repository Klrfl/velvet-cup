<script setup lang="ts">
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
		<input
			type="text"
			placeholder="nama"
			:value="menu.name"
			name="menu_name"
			required
		/>
		<textarea placeholder="deskripsi" name="menu_description" required>
      {{ menu.description }}</textarea
		>

		<button type="submit">Sunting</button>
	</form>
</template>
