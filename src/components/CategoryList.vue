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
		class="col-span-full md:col-span-2 md:row-span-2"
		@category-added="(newCategory) => categories.push(newCategory)"
	/>

	<p class="col-span-full md:col-span-4">
		Showing {{ categoryCount }} categories.
	</p>
	<ul class="grid gap-4 col-span-full md:col-span-4 md:col-start-3">
		<li
			v-for="category in categories"
			:key="category.id"
			class="bg-primary/5 p-4 rounded-lg"
		>
			{{ category.name }}
		</li>
	</ul>
</template>
