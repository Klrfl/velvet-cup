<script setup lang="ts">
import BasketItem from "@/components/BasketItem.vue"
import { Toaster } from "@/components/ui/sonner"
import { ref } from "vue"
import { toast } from "vue-sonner"

interface Props {
	basket: {
		id: number
		menu_name: string
		quantity: number
		variant_name: string
		price: number
	}[]
}

const props = defineProps<Props>()
const basket = ref(props.basket)

async function handleDeleteItem(basketItem: (typeof basket.value)[0]) {
	const response = await fetch(`/api/baskets/${basketItem.id}`, {
		method: "DELETE",
	})

	if (response.status === 200) {
		toast.success("sucessfully deleted item.")

		basket.value = basket.value.filter((item) => item.id !== basketItem.id)
	}
}
</script>

<template>
	<ul class="grid gap-4">
		<BasketItem
			v-for="item in basket"
			:basket-item="item"
			@trigger-delete="handleDeleteItem(item)"
		/>
	</ul>

	<Toaster rich-colors />
</template>
