<script setup lang="ts">
import type { Menu } from "@/database/database.types"
import type { Selectable } from "kysely"

import MenuItem from "@/components/MenuItem.vue"
import MenuAdd from "@/components/MenuAdd.vue"
import { ref } from "vue"

interface Props {
	menu: Selectable<Menu>[]
}

const props = defineProps<Props>()
const menuList = ref(props.menu)

function handleAddMenu(newMenu: Selectable<Menu>) {
	menuList.value.push(newMenu)
}

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

	<aside
		class="order-first col-span-full md:col-span-4 lg:col-span-3 sticky top-0"
	>
		<h2 class="text-lg">Tambahkan menu baru</h2>

		<MenuAdd @menuAdded="handleAddMenu" />
	</aside>
</template>
