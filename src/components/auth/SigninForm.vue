<script setup lang="ts">
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function handleSignIn(form: HTMLFormElement) {
	const formData = new FormData(form)
	console.log(formData)
}
</script>

<template>
	<form
		class="grid gap-4"
		@submit.prevent="(e) => handleSignIn(e.currentTarget as HTMLFormElement)"
	>
		<Label for="email">Email</Label>
		<Input type="email" id="email" name="email" placeholder="email" required />

		<Label for="password">Password</Label>
		<Input
			type="password"
			id="password"
			name="password"
			placeholder="your secret password"
			required
		/>

		<Button type="submit">Submit</Button>
	</form>
</template>
