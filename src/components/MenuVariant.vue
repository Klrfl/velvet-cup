<script setup lang="ts">
import { Pencil } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import type { MenuVariant } from "@/types"
import { formatCurrency } from "@/lib/utils"

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
		class="grid grid-cols-6 grid-flow-row-dense outline-solid outline-slate-100 px-4 py-3 rounded-lg"
	>
		<span class="col-span-4">
			{{ variant.name }} -
			<span class="font-bold">{{ formatCurrency(variant.price) }}</span>
		</span>

		<div
			v-for="variant_option in variant.options"
			:key="`${variant_option.option_value_id}-${variant_option.option_value}`"
			class="ml-4 col-span-4"
		>
			{{ variant_option.option_name }} - {{ variant_option.option_value }}
		</div>

		<Button
			variant="outline"
			class="col-span-2 place-self-end"
			@click="emit('triggerVariantEdit', variant)"
		>
			<Pencil fill="white" />
			Edit
		</Button>
	</li>
</template>
