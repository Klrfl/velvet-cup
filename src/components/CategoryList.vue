<script setup lang="ts">
import type { MenuCategories } from "@/database/database.types"
import type { Selectable } from "kysely"
import CategoryAdd from "@/components/CategoryAdd.vue"
import { ref } from "vue"

interface Props {
	categories: Selectable<MenuCategories>[]
}

const props = defineProps<Props>()
const categories = ref(props.categories)
</script>

<template>
	<CategoryAdd
		@category-added="(newCategory) => categories.push(newCategory)"
	/>

	<ul class="grid gap-4">
		<li
			v-for="category in categories"
			:key="category.id"
			class="bg-primary/5 p-4 rounded-lg"
		>
			{{ category.name }}
		</li>
	</ul>
</template>
