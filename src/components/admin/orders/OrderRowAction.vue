<script setup lang="ts">
import { Ellipsis } from "lucide-vue-next"
import { Button } from "@/components/ui/button"

const emit = defineEmits<{
	(e: "expand"): void
}>()
</script>

<template>
	<Button variant="outline" title="See order details" @click="emit('expand')">
		<Ellipsis />
	</Button>
</template>
