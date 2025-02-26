<script setup lang="ts">
import { Button } from "@/components/ui/button"

const emit = defineEmits<{
	(e: "expand"): void
}>()
</script>

<template>
	<Button @click="emit('expand')" variant="outline">Lihat selengkapnya</Button>
</template>
