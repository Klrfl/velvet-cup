<script setup lang="ts">
import { GroupedBar } from "@unovis/ts"
import {
	VisXYContainer,
	VisLine,
	VisAxis,
	VisTooltip,
	VisGroupedBar,
} from "@unovis/vue"

type OrderStat = {
	order_count: number
	ordered_at: Date
}

interface Props {
	data: OrderStat[]
	title?: string
}

const { data, title } = defineProps<Props>()

const x = (d: OrderStat) => d.ordered_at
const y = (d: OrderStat) => d.order_count

const triggers = {
	[GroupedBar.selectors.bar]: (
		d: OrderStat
	) => `<span class="bg-white text-xs rounded-lg p-4 px-6">
${new Date(d.ordered_at).toDateString()}
</span>`,
}
</script>

<template>
	<h2 class="sr-only">{{ title }}</h2>

	<VisXYContainer :data="data">
		<VisGroupedBar :x="x" :y="y" />
		<VisAxis
			type="x"
			label="Order date"
			:tick-format="(a: OrderStat['ordered_at']) => new Date(a).toDateString()"
			:num-ticks="15"
		/>
		<VisAxis type="y" label="Amount" />

		<VisTooltip :triggers="triggers" />
	</VisXYContainer>
</template>
