<script setup lang="ts">
import { Pencil } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import type { menuAdminReturnType } from "@/database/queries"

interface Props {
	option: menuAdminReturnType[0]["options"][0]
}

const props = defineProps<Props>()
const emit = defineEmits<{
	(e: "triggerOptionEdit", option: typeof props.option): void
}>()
</script>

<template>
	<li class="flex items-center outline outline-slate-100 px-4 py-3 rounded-lg">
		<span class="font-bold">
			{{ option.name }}
		</span>

		<ul class="flex gap-4">
			<template
				v-for="option_value in option.option_values"
				:key="option_value.id"
			>
				<li v-if="option_value.id" class="px-4 py-2">
					{{ option_value.name }}
				</li>
			</template>
		</ul>

		<Button
			variant="outline"
			@click="emit('triggerOptionEdit', option)"
			class="ml-auto"
		>
			<Pencil fill="white" />
			Edit
		</Button>
	</li>
</template>
