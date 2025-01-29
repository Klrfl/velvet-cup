<script setup lang="ts">
import type { Menu } from "@/database/database.types"
import type { Selectable } from "kysely"

import MenuItem from "@/components/MenuItem.vue"
import { ref } from "vue"
import type { MenuWithCategories } from "@/types"

interface Props {
	menu: MenuWithCategories[]
}

const props = defineProps<Props>()
const menuList = ref(props.menu)

function handleDeleteMenu(targetMenu: Selectable<Menu>) {
	menuList.value = menuList.value.filter((menu) => menu.id !== targetMenu.id)
}
</script>

<template>
	<ul
		class="col-span-full md:col-span-8 lg:col-span-9 lg:grid lg:gap-8 lg:grid-cols-2"
	>
		<MenuItem
			v-for="item in menuList"
			:menu="item"
			@menu-deleted="handleDeleteMenu(item)"
		/>
	</ul>
</template>
