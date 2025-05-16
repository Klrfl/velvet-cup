<script setup lang="ts">
import type { AdminOrdersReturnType } from "@/database/queries"
import { formatCurrency, formatDate, valueUpdater } from "@/lib/utils"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectItem,
} from "@/components/ui/select"
import {
	createColumnHelper,
	FlexRender,
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	useVueTable,
	type ColumnFiltersState,
	type ExpandedState,
} from "@tanstack/vue-table"
import { h, ref } from "vue"
import OrderRowAction from "./OrderRowAction.vue"
import OrderStatus from "./OrderStatus.vue"

interface Props {
	orders: AdminOrdersReturnType
}

const columnHelper = createColumnHelper<AdminOrdersReturnType[0]>()

const columns = [
	columnHelper.accessor("user_name", {
		header: "user name",
		cell: (ctx) => ctx.getValue(),
	}),
	columnHelper.accessor("status", {
		header: "status",
		cell: (ctx) => h(OrderStatus, { status: ctx.getValue() }),
	}),
	columnHelper.accessor(
		(ctx) => {
			const total = ctx.details.reduce((acc, next) => {
				return acc + Number(next.price) * next.quantity
			}, 0)

			return formatCurrency(total)
		},
		{ header: "total amount" }
	),
	columnHelper.accessor("created_at", {
		header: "ordered at",
		cell: (ctx) => {
			const date = ctx.getValue()
			const formatted = formatDate(date, {
				dateStyle: "medium",
				timeStyle: "short",
			})

			return formatted
		},
	}),
	columnHelper.display({
		header: "details",
		cell: (ctx) =>
			h(OrderRowAction, {
				onExpand: ctx.row.toggleExpanded,
			}),
	}),
]

const isExpanded = ref<ExpandedState>({})
const columnFilters = ref<ColumnFiltersState>([])
const { orders } = defineProps<Props>()

const table = useVueTable({
	data: orders,
	columns,
	getCoreRowModel: getCoreRowModel(),
	getExpandedRowModel: getExpandedRowModel(),
	onExpandedChange: (updaterOrValue) =>
		valueUpdater(updaterOrValue, isExpanded),
	getFilteredRowModel: getFilteredRowModel(),
	onColumnFiltersChange: (updaterOrValue) =>
		valueUpdater(updaterOrValue, columnFilters),
	state: {
		get expanded() {
			return isExpanded.value
		},
		get columnFilters() {
			return columnFilters.value
		},
	},
})
</script>

<template>
	<div class="flex gap-4">
		<Input
			placeholder="filter by username"
			:model-value="table?.getColumn('user_name')?.getFilterValue() as string"
			@update:model-value="
				table?.getColumn('user_name')?.setFilterValue($event)
			"
		/>

		<Select
			:model-value="table.getColumn('status')?.getFilterValue() as string"
			@update:model-value="
				(value) => {
					return value === 'all'
						? table.getColumn('status')?.setFilterValue(null)
						: table?.getColumn('status')?.setFilterValue(value)
				}
			"
		>
			<SelectTrigger>
				<SelectValue placeholder="Filter by status" />
			</SelectTrigger>

			<!-- TODO: get statuses from database -->
			<SelectContent>
				<SelectItem value="all"> All </SelectItem>
				<SelectItem value="completed"> Completed </SelectItem>
				<SelectItem value="pending"> Pending </SelectItem>
			</SelectContent>
		</Select>
	</div>

	<Table>
		<TableHeader>
			<TableRow
				v-for="headerGroup in table.getHeaderGroups()"
				:key="headerGroup.id"
			>
				<TableHead v-for="header in headerGroup.headers" :key="header.id">
					<FlexRender
						v-if="!header.isPlaceholder"
						:render="header.column.columnDef.header"
						:props="header.getContext()"
					/>
				</TableHead>
			</TableRow>
		</TableHeader>

		<TableBody>
			<template v-if="table.getRowModel().rows.length">
				<template v-for="row in table.getRowModel().rows" :key="row.id">
					<TableRow>
						<TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
							<FlexRender
								:render="cell.column.columnDef.cell"
								:props="cell.getContext()"
							/>
						</TableCell>
					</TableRow>

					<TableRow v-if="row.getIsExpanded()">
						<TableCell :colspan="row.getAllCells().length">
							<Table>
								<TableHeader>
									<TableHead> Menu name </TableHead>
									<TableHead> Unit price </TableHead>
									<TableHead> quantity </TableHead>
									<TableHead> Total </TableHead>
								</TableHeader>

								<TableRow
									v-for="detail in row.original.details"
									:key="detail.id"
								>
									<TableCell>{{ detail.menu_name }}</TableCell>
									<TableCell>{{ detail.quantity }}</TableCell>
									<TableCell>
										{{ formatCurrency(Number(detail.price)) }}
									</TableCell>
									<TableCell>
										{{ formatCurrency(Number(detail.price) * detail.quantity) }}
									</TableCell>
								</TableRow>
							</Table>
						</TableCell>
					</TableRow>
				</template>
			</template>

			<template v-else>
				<TableCell :col-span="columns.length" class="text-center">
					No results found.
				</TableCell>
			</template>
		</TableBody>
	</Table>
</template>
