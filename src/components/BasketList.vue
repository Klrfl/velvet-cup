<script setup lang="ts">
import BasketItem from "@/components/BasketItem.vue"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { computed, ref } from "vue"
import { toast } from "vue-sonner"
import { useDebounceFn } from "@vueuse/core"

interface Props {
	basket: {
		id: number
		menu_name: string
		image: string
		quantity: number
		variant_id: number
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

async function handleQty(
	basketItem: (typeof basket.value)[0],
	operation: "add" | "subtract"
) {
	switch (operation) {
		case "add":
			basketItem.quantity += 1
			break
		case "subtract":
			basketItem.quantity -= 1
			break
		default:
			console.error("what")
			break
	}

	basket.value[basket.value.indexOf(basketItem)] = basketItem

	const debouncedPost = useDebounceFn(
		async () => {
			const response = await fetch(`/api/baskets/${basketItem.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(basketItem),
			})

			if (response.status !== 200) {
				if (import.meta.env.DEV) console.error(response)

				toast.error("an error occured when adding quantity.")
			}

			console.log(await response.json())
		},
		1000,
		{ maxWait: 5000 }
	)

	debouncedPost()
}

const total = computed(() =>
	basket.value.reduce((acc, item) => Number(item.price) + acc, 0)
)
</script>

<template>
	<ul class="app-section col-start-2 col-span-8">
		<BasketItem
			v-for="item in basket"
			:basket-item="item"
			@trigger-add-qty="handleQty(item, 'add')"
			@trigger-subtract-qty="handleQty(item, 'subtract')"
			@trigger-delete="handleDeleteItem(item)"
		/>
	</ul>

	<section class="app-section col-span-4 flex flex-col gap-4">
		<h2 class="text-4xl">Checkout</h2>
		<span
			>total:
			{{
				Intl.NumberFormat("id-ID", {
					style: "currency",
					currency: "IDR",
				}).format(total)
			}}</span
		>
		<Button>Check out</Button>
	</section>

	<Toaster rich-colors />
</template>
