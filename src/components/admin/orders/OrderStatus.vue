<script setup lang="ts">
interface Props {
	status: string
}

const { status } = defineProps<Props>()
</script>

<template>
	<span
		:class="[
			'text-left py-2 px-3 rounded-full',
			'outline outline-1',
			'block w-full text-center',
			{
				'bg-yellow-200 outline-yellow-400': status === 'pending',
				'bg-green-200 outline-green-400': status === 'completed',
			},
		]"
	>
		{{ status }}
	</span>
</template>
