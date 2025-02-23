<script setup lang="ts">
import { Button } from "@/components/ui/button"
import type { MenuWithCategories } from "@/types"
import { Pencil, Trash } from "lucide-vue-next"

interface Props {
	menu: MenuWithCategories
}

defineProps<Props>()
const emit = defineEmits(["menuDeleted"])

async function deleteMenu(id: number) {
	const res = await fetch(`/api/admin/menu/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	})

	const { message } = await res.json()

	if (res.status === 200) {
		emit("menuDeleted", message)
	}

	// TODO: validate response
}
</script>

<template>
	<li class="p-4 border-b border-b-slate-200">
		<p class="leading-tight text-lg font-bold">{{ menu.name }}</p>
		<p>{{ menu.description }}</p>
		<p v-if="menu.category" class="text-sm text-primary-400">
			{{ menu.category }}
		</p>

		<div class="py-4 flex gap-2">
			<Button variant="outline" as-child>
				<a :href="`/admin/menu/${menu.id}/`" class="flex gap-2">
					<Pencil />
					Edit
				</a>
			</Button>

			<Button variant="outline" @click="deleteMenu(menu.id)">
				<Trash />
				Hapus
			</Button>
		</div>
	</li>
</template>
