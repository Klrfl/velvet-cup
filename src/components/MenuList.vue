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
</script>

<template>
	<ul id="menu-list">
		<MenuItem v-for="item in menuList" :menu="item" />
	</ul>

	<MenuAdd @menuAdded="handleAddMenu" />
</template>
