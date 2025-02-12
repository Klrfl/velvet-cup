<script setup lang="ts">
import { Input } from "@/components/ui/input"
</script>

<template>
	<form
		@submit.prevent="(e) => console.log(e.currentTarget as HTMLFormElement)"
	>
		<label for="email">Email</label>
		<Input type="text" required />

		<label for="name">Name</label>
		<label for="password">Password</label>
		<label for="confirm-password">Confirm Password</label>
	</form>
</template>
