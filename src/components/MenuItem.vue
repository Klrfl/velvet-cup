<script setup lang="ts">
import type { Menu } from "@/database/database.types"
import { formatDate } from "@/utils/index.ts"
import type { Selectable } from "kysely"

interface Props {
	menu: Selectable<Menu>
}

defineProps<Props>()
const emit = defineEmits(["menuDeleted"])

async function deleteMenu(id: number) {
	const res = await fetch(`/api/admin/menu/${id}`, {
		method: "DELETE",
	})

	const data = await res.json()

	if (res.status === 200) {
		emit("menuDeleted")
		console.log(data)
	}

	// TODO: validate response
}
</script>

<template>
	<li>
		<p>{{ menu.name }} - {{ menu.description }}</p>
		<p v-if="menu.created_at">{{ formatDate(new Date(menu.created_at)) }}</p>

		<a :href="`/admin/menu/${menu.id}`">edit</a>
		<button @click="deleteMenu(menu.id)">Hapus</button>
	</li>
</template>
