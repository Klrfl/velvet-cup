<script setup lang="ts">
import { Pencil } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import type { MenuVariant } from "@/types"
import { formatCurrency } from "@/utils"

interface Props {
	variant: MenuVariant
}

const props = defineProps<Props>()
const emit = defineEmits<{
	(e: "triggerVariantEdit", variant: typeof props.variant): void
}>()
</script>

<template>
	<li
		class="grid grid-cols-6 grid-flow-row-dense outline outline-slate-100 px-4 py-3 rounded-lg"
	>
		<span class="col-span-4">
			{{ variant.name }} -
			<span class="font-bold">{{ formatCurrency(variant.price) }}</span>
		</span>

		<div v-for="variant_option in variant.options" class="ml-4 col-span-4">
			{{ variant_option.option_name }} - {{ variant_option.option_value }}
		</div>

		<Button
			variant="outline"
			@click="emit('triggerVariantEdit', variant)"
			class="col-span-2 place-self-end"
		>
			<Pencil fill="white" />
			Edit
		</Button>
	</li>
</template>
