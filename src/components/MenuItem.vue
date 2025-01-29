<script setup lang="ts">
import { Button } from "@/components/ui/button"
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
	}

	// TODO: validate response
}
</script>

<template>
	<li class="p-4 border-b border-b-slate-200">
		<p>{{ menu.name }}</p>
		<p>{{ menu.description }}</p>

		<p v-if="menu.created_at">{{ formatDate(new Date(menu.created_at)) }}</p>

		<div class="py-4 flex gap-2">
			<Button variant="link" as-child>
				<a :href="`/admin/menu/${menu.id}`">Edit</a>
			</Button>

			<Button @click="deleteMenu(menu.id)">Hapus</Button>
		</div>
	</li>
</template>
