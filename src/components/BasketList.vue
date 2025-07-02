<script setup lang="ts">
import BasketItem from "@/components/BasketItem.vue"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { computed, ref } from "vue"
import { toast } from "vue-sonner"
import { useDebounceFn, useFetch } from "@vueuse/core"
import { formatCurrency } from "@/lib/utils"
import type { BasketComplete } from "@/types"

interface Props {
	basket: BasketComplete[]
}

const props = defineProps<Props>()
const basket = ref(props.basket)

async function handleDeleteItem(basketItem: (typeof basket.value)[0]) {
	const { error } = await useFetch(`/api/baskets/${basketItem.id}`)
		.delete()
		.json()

	if (error.value) {
		console.log(error.value)
		return toast.error("something went wrong when deleting menu item")
	}

	toast.success("sucessfully deleted item.")
	return (basket.value = basket.value.filter(
		(item) => item.id !== basketItem.id
	))
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
			const { error } = await useFetch(`/api/baskets/${basketItem.id}`)
				.put(basketItem)
				.json()

			if (error.value) {
				if (import.meta.env.DEV) console.error(error.value)
				return toast.error("an error occured when adding quantity.")
			}
		},
		1000,
		{ maxWait: 5000 }
	)

	debouncedPost()
}

async function handleCheckout() {
	const { data: response, error } = await useFetch("/api/checkout")
		.post()
		.json()

	if (error.value) {
		console.error(error.value)
		console.error(response.value)

		return toast.error("failed to checkout")
	}

	const { data } = response.value

	//@ts-expect-error the snap library requires me to do this.. please stop
	return window.snap.pay(data.token)
}

const total = computed(() =>
	basket.value.reduce(
		(acc, item) => Number(item.price) * item.quantity + acc,
		0
	)
)
</script>

<template>
	<ul class="app-section col-start-2 col-span-8">
		<li v-if="basket.length === 0" class="flex flex-col items-center">
			<p class="text-xl font-bold">Your basket is currently empty.</p>
			<p>Go check out our menus!</p>

			<Button as-child>
				<a href="/">Explore our menu</a>
			</Button>
		</li>

		<template v-else>
			<BasketItem
				v-for="item in basket"
				:key="item.id"
				:basket-item="item"
				@trigger-add-qty="handleQty(item, 'add')"
				@trigger-subtract-qty="handleQty(item, 'subtract')"
				@trigger-delete="handleDeleteItem(item)"
			/>
		</template>
	</ul>

	<section class="app-section col-span-4 flex flex-col gap-4">
		<h2 class="text-4xl">Checkout</h2>

		<template v-for="item in basket" :key="item.id">
			<p v-if="item" class="flex">
				{{ item.quantity }} ×
				{{ formatCurrency(Number(item.price)) }}

				<span class="ml-auto">
					{{ formatCurrency(item.quantity * Number(item.price)) }}
				</span>
			</p>
		</template>

		<hr />

		<p class="flex justify-between">
			<span>total:</span>
			<span v-if="total > 0" class="font-bold">
				{{ formatCurrency(total) }}
			</span>
			<span v-else>-</span>
		</p>

		<Button
			:disabled="total === 0"
			:variant="total === 0 ? 'outline' : 'default'"
			@click="handleCheckout"
		>
			Check out
		</Button>
	</section>

	<Toaster rich-colors />
</template>
