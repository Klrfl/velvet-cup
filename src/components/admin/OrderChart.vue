<script setup lang="ts">
import { VisXYContainer, VisLine, VisAxis } from "@unovis/vue"

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

/**
TODO: create tooltips to show date of order
*/
</script>

<template>
	<h1>{{ title }}</h1>

	<VisXYContainer :data="data">
		<VisLine :x="x" :y="y" :fallback-value="0" />
		<VisAxis
			type="x"
			label="Order date"
			:tick-format="(a: OrderStat['ordered_at']) => new Date(a).toDateString()"
			:num-ticks="15"
		/>
		<VisAxis type="y" label="Amount" />
	</VisXYContainer>
</template>
