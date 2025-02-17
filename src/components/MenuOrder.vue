<script setup lang="ts">
import type { MenuPrice } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "vue-sonner"
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs"
import { computed, ref } from "vue"

interface Props {
	variants: MenuPrice[]
	menu_id: number
}

const { variants, menu_id } = defineProps<Props>()

const defaultVariant = computed(() => variants[0])
const selectedVariant = ref(defaultVariant.value)
const quantity = ref(1)

async function addToCart() {
	const body = {
		menu_id,
		variant_id: selectedVariant.value.id,
		quantity: quantity.value,
	}

	const response = await fetch("/api/baskets", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	})

	const result = await response.json()

	toast.success(result.message)
	// console.log(result.data)
}
</script>

<template>
	<Tabs :default-value="defaultVariant.id" class="col-span-8">
		<TabsList v-for="variant in variants">
			<TabsTrigger
				:value="variant.id"
				class="outline outline-1 outline-primary data-[active=true]:bg-primary-400 data-[active=true]:text-white"
				@click="selectedVariant = variant"
			>
				{{ variant.name }}
			</TabsTrigger>
		</TabsList>

		<template v-for="{ id, price } in variants">
			<TabsContent :value="id" class="text-xl font-bold">
				{{
					new Intl.NumberFormat("id-ID", {
						style: "currency",
						currency: "IDR",
					}).format(Number(price))
				}}
			</TabsContent>
		</template>
	</Tabs>

	<Label for="quantity">Quantity</Label>
	<Input
		type="number"
		id="quantity"
		name="quantity"
		v-model="quantity"
		:default-value="quantity"
		:invalid="quantity === 0"
		:min="1"
		:max="30"
	/>

	<Button
		class="justify-self-start col-span-full"
		:disabled="!selectedVariant"
		@click="addToCart"
	>
		Buy now
	</Button>

	<Toaster rich-colors />
</template>
