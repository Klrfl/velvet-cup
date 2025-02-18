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

async function handleCheckout() {
	const response = await fetch("/api/checkout", {
		method: "POST",
	})

	const result = await response.json()
	const { data } = result

	//@ts-expect-error
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
				:basket-item="item"
				@trigger-add-qty="handleQty(item, 'add')"
				@trigger-subtract-qty="handleQty(item, 'subtract')"
				@trigger-delete="handleDeleteItem(item)"
			/>
		</template>
	</ul>

	<section class="app-section col-span-4 flex flex-col gap-4">
		<h2 class="text-4xl">Checkout</h2>

		<p v-for="item in basket" class="flex">
			{{ item.quantity }} ×
			{{
				Intl.NumberFormat("id-ID", {
					style: "currency",
					currency: "IDR",
				}).format(item.price)
			}}

			<span class="ml-auto">
				{{
					Intl.NumberFormat("id-ID", {
						style: "currency",
						currency: "IDR",
					}).format(item.quantity * item.price)
				}}
			</span>
		</p>

		<hr />

		<p class="flex justify-between">
			<span>total:</span>
			<span v-if="total > 0" class="font-bold">
				{{
					Intl.NumberFormat("id-ID", {
						style: "currency",
						currency: "IDR",
					}).format(total)
				}}
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
