<script setup lang="ts">
import type { MenuPrice } from "@/types"
import { Button } from "@/components/ui/button"
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs"
import { computed } from "vue"

interface Props {
	variants: MenuPrice[]
}

const { variants } = defineProps<Props>()

const defaultVariant = computed(() => variants[0].id)
</script>

<template>
	<Tabs :default-value="defaultVariant" class="col-span-8">
		<TabsList v-for="variant in variants">
			<TabsTrigger
				:value="variant.id"
				class="outline outline-1 outline-primary data-[active=true]:bg-primary-500 data-[active=true]:text-white"
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

	<Button class="justify-self-start col-span-full">Buy now</Button>
</template>
