<script setup lang="ts">
import { VisXYContainer, VisLine, VisAxis } from "@unovis/vue"

type OrderStat = {
	order_count: number
	ordered_at: Date
}

const { data } = defineProps<{ data: OrderStat[] }>()

const x = (d: OrderStat) => d.ordered_at
const y = (d: OrderStat) => d.order_count
</script>

<template>
	<h1>Chart ceritanya</h1>
	<VisXYContainer :data="data">
		<VisLine :x="x" :y="y" />
		<VisAxis type="x" label="Order date" />
		<VisAxis type="y" label="Amount" />
	</VisXYContainer>
</template>
