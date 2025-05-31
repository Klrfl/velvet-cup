<script lang="ts" setup>
import { Button } from "@/components/ui/button"
import type { BasketComplete } from "@/types"

interface Props {
	basketItem: BasketComplete
}

const { basketItem: item } = defineProps<Props>()
const emit = defineEmits<{
	(e: "triggerDelete"): void
	(e: "triggerAddQty"): void
	(e: "triggerSubtractQty"): void
}>()
</script>

<template>
	<li class="flex items-center gap-4">
		<figure class="w-24">
			<img
				:src="item.image ?? '/Image_not_available.png'"
				alt=""
				width="200"
				height="200"
				class="object-cover max-w-full aspect-square"
			/>
		</figure>

		<article class="grow grid grid-cols-6 grid-flow-dense gap-2">
			<span class="col-span-4"
				>{{ item.menu_name }} - {{ item.variant_name }}</span
			>

			<span class="font-bold col-end-[-1] col-span-2 text-right">
				{{
					new Intl.NumberFormat("id-ID", {
						style: "currency",
						currency: "IDR",
					}).format(Number(item.price))
				}}
			</span>

			<div class="flex gap-2 col-end-[-1]">
				<Button
					size="sm"
					variant="outline"
					class="ml-auto"
					:disabled="item.quantity >= 50"
					@click="emit('triggerAddQty')"
					>+</Button
				>
				<span>{{ item.quantity }}</span>
				<Button
					size="sm"
					variant="outline"
					:disabled="item.quantity <= 1"
					@click="emit('triggerSubtractQty')"
				>
					-
				</Button>
			</div>

			<Button title="remarks">Remarks</Button>
			<Button variant="outline" @click="emit('triggerDelete')">Delete</Button>
		</article>
	</li>
</template>
