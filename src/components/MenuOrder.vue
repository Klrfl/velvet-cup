<script setup lang="ts">
import type { MenuPrice } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "vue-sonner"
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs"
import { computed, ref } from "vue"
import { formatCurrency } from "@/utils"

interface Props {
	variants: MenuPrice[]
	menu_id: number
	user_id?: string
}

const { user_id, variants, menu_id } = defineProps<Props>()

const defaultVariant = computed(() => variants[0])
const selectedVariant = ref(defaultVariant.value)
const quantity = ref(1)

async function addToCart() {
	if (!user_id) return window.location.assign("/login")

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
				class="data-[state=active]:text-white data-[state=active]:bg-primary"
				@click="selectedVariant = variant"
			>
				{{ variant.name }}
			</TabsTrigger>
		</TabsList>

		<template v-for="{ id, price } in variants">
			<TabsContent :value="id" class="text-xl font-bold">
				{{ formatCurrency(Number(price)) }}
			</TabsContent>
		</template>
	</Tabs>

	<div
		class="grid grid-cols-3 col-span-2 rounded-lg ring ring-gray-100 has-[:focus-visible]:ring-primary"
	>
		<Button
			@click="quantity > 0 ? quantity-- : quantity"
			variant="ghost"
			class="h-full rounded-none"
			title="decrement quantity"
		>
			-
		</Button>
		<Input
			type="text"
			inputmode="numeric"
			id="quantity"
			name="quantity"
			v-model="quantity"
			class="rounded-none text-center border-none focus-visible:ring-0 focus-visible:ring-offset-0"
			:default-value="quantity"
			:invalid="quantity === 0"
			:min="1"
			:max="30"
		/>
		<Button
			@click="quantity++"
			variant="ghost"
			class="h-full rounded-none"
			title="increment quantity"
		>
			+
		</Button>
	</div>
	<Button
		class="justify-self-start col-span-full"
		:disabled="!selectedVariant"
		@click="addToCart"
	>
		Buy now
	</Button>

	<Toaster rich-colors />
</template>
