<script setup lang="ts">
import type { MenuCategories } from "@/database/database.types"
import type { Selectable } from "kysely"
import CategoryAdd from "@/components/CategoryAdd.vue"
import { computed, ref } from "vue"

interface Props {
	categories: Selectable<MenuCategories>[]
}

const props = defineProps<Props>()
const categories = ref(props.categories)

const categoryCount = computed(() => categories.value.length)
</script>

<template>
	<CategoryAdd
		class="bg-card p-6 px-4 rounded-lg col-span-full md:col-span-2"
		@category-added="(newCategory) => categories.push(newCategory)"
	/>

	<p class="md:order-last md:col-span-2">
		Showing {{ categoryCount }} categories.
	</p>

	<ul
		class="grid gap-4 col-span-full md:col-span-4 md:col-start-3 md:row-span-2"
	>
		<li
			v-for="category in categories"
			:key="category.id"
			class="bg-card p-4 rounded-lg"
		>
			{{ category.name }}
		</li>
	</ul>
</template>
