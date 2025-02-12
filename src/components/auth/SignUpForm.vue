<script setup lang="ts">
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
</script>

<template>
	<form
		@submit.prevent="(e) => console.log(e.currentTarget as HTMLFormElement)"
		class="grid gap-4"
	>
		<Label for="email">Email</Label>
		<Input
			type="email"
			name="email"
			id="email"
			placeholder="your email here..."
			required
		/>

		<Label for="name">Name</Label>
		<Input
			type="text"
			name="name"
			id="name"
			placeholder="your name..."
			required
		/>
		<Label for="password">Password</Label>
		<Input
			type="password"
			name="password"
			id="password"
			placeholder="your super secret password..."
			required
		/>
		<Label for="confirm-password">Confirm Password</Label>
		<Input
			type="password"
			placeholder="your super secret password, again"
			name="password"
			id="password"
			required
		/>

		<Button type="submit">Sign up</Button>
	</form>
</template>
