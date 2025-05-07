<script setup lang="ts">
import type { HTMLAttributes } from "vue"

interface Props {
	status: "pending" | "completed"
	class?: HTMLAttributes["class"]
}

const { status, class: className } = defineProps<Props>()
</script>

<template>
	<span
		:class="[
			'text-center py-2 px-3 rounded-full',
			'outline outline-1',
			'block w-full text-sm',
			{
				'bg-yellow-200/80 outline-yellow-400': status === 'pending',
				'bg-green-200/80 outline-green-400': status === 'completed',
			},
			className,
		]"
	>
		{{ status }}
	</span>
</template>
