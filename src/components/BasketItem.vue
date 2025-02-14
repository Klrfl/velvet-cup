<script lang="ts" setup>
import { Button } from "@/components/ui/button"

interface Props {
	basketItem: {
		id: number
		menu_name: string
		quantity: number
		variant_name: string
		price: number
	}
}

const { basketItem: item } = defineProps<Props>()
const emit = defineEmits<{
	(e: "triggerDelete"): void
}>()
</script>

<template>
	<li class="flex items-center gap-4">
		<span>{{ item.menu_name }}</span>
		<span>{{ item.quantity }}</span>
		<span>{{ item.variant_name }}</span>
		<span class="font-bold">{{ item.price }}</span>

		<Button variant="outline" class="ml-auto" @click="emit('triggerDelete')"
			>Delete</Button
		>
	</li>
</template>
