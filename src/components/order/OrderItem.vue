<script setup lang="ts">
import type { Order } from "@/types/"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	Table,
	TableBody,
	TableRow,
	TableCell,
	TableCaption,
} from "@/components/ui/table"
import OrderStatus from "../admin/orders/OrderStatus.vue"

interface Props {
	order: Order
}

const { order } = defineProps<Props>()

async function attemptPaying(orderId: Order["id"]) {
}

async function cancelOrder(orderId: Order["id"]) {
	const response = await fetch(`/api/cancel?id=${orderId}`)
	const result = await response.json()
	console.log(result)
}
</script>

<template>
	<li class="app-section relative">
		<OrderStatus
			:status="order.status"
			class="absolute left-0 top-0 w-min -translate-y-1/2 -translate-x-4"
		/>

		<Table class="overflow-visible">
			<TableCaption>
				ordered at {{ formatDate(order.created_at) }}
			</TableCaption>

			<TableBody>
				<TableRow v-for="d in order.details" :key="d.id">
					<TableCell>{{ d.menu_name }}</TableCell>
					<TableCell>{{ d.quantity }}</TableCell>
					<TableCell>{{ formatCurrency(Number(d.price)) }}</TableCell>
					<TableCell>
						{{ formatCurrency(Number(d.quantity * Number(d.price))) }}
					</TableCell>
				</TableRow>

				<TableRow>
					<TableCell colspan="3" class="text-right">Total:</TableCell>
					<TableCell class="font-bold">
						{{
							formatCurrency(
								order.details.reduce(
									(acc, detail) => detail.quantity * Number(detail.price) + acc,
									0
								)
							)
						}}
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>

		<div v-if="order.status === 'pending'" class="flex gap-4 items-center">
			<Button @click="attemptPaying(order.id)">Pay</Button>
			<Button @click="cancelOrder(order.id)">Cancel</Button>
		</div>
	</li>
</template>
