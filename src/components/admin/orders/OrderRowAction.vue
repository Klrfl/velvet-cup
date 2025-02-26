<script setup lang="ts">
import { Ellipsis } from "lucide-vue-next"
import { Button } from "@/components/ui/button"

const emit = defineEmits<{
	(e: "expand"): void
}>()
</script>

<template>
	<Button @click="emit('expand')" variant="outline" title="See order details">
		<Ellipsis />
	</Button>
</template>
