<script setup lang="ts">
import type { Menu } from "@/database/database.types"
import type { Selectable } from "kysely"

import MenuItem from "@/components/MenuItem.vue"
import { ref } from "vue"
import type { MenuWithCategories } from "@/types"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "vue-sonner"

interface Props {
	menu: MenuWithCategories[]
}

const props = defineProps<Props>()
const menuList = ref(props.menu)

function handleDeleteMenu(targetMenu: Selectable<Menu>) {
	menuList.value = menuList.value.filter((menu) => menu.id !== targetMenu.id)

	toast.success("Sucessfully deleted menu item", {
		description: `Successfully deleted menu item ${targetMenu.name}`,
	})
}
</script>

<template>
	<ul class="col-span-full grid gap-y-4 grid-cols-2 lg:grid-cols-4">
		<li v-if="!menuList.length">no menu items to display.</li>
		<MenuItem
			v-for="item in menuList"
			:key="item.id"
			:menu="item"
			@menu-deleted="handleDeleteMenu(item)"
		/>

		<Toaster rich-colors />
	</ul>
</template>
