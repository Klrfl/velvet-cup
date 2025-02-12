<script setup lang="ts">
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "vue-sonner"
import { authClient } from "@/lib/auth-client"

import { ref } from "vue"

interface SignUpData {
	name: string
	email: string
	password: string
	confirmPassword: string
}

const credentials = ref<SignUpData>({
	name: "",
	email: "",
	password: "",
	confirmPassword: "",
})

async function handleSignUp(credentials: SignUpData) {
	if (credentials.password !== credentials.confirmPassword) {
		toast.error("your password doesn't match.")
	}

	const { data, error } = await authClient.signUp.email({
		email: credentials.email,
		name: credentials.name,
		password: credentials.password,
	})

	if (error) {
		if (import.meta.env.DEV) console.error(error)
		return toast.error(
			"There was an error creating your account. Please try again later."
		)
	}

	window.location.assign("/")
}
</script>

<template>
	<form @submit.prevent="handleSignUp(credentials)" class="grid gap-4">
		<Label for="name">Name</Label>
		<Input
			v-model="credentials.name"
			type="text"
			name="name"
			id="name"
			placeholder="your name..."
			required
		/>

		<Label for="email">Email</Label>
		<Input
			v-model="credentials.email"
			type="email"
			name="email"
			id="email"
			placeholder="your email here..."
			required
		/>

		<Label for="password">Password</Label>
		<Input
			v-model="credentials.password"
			type="password"
			name="password"
			id="password"
			placeholder="your super secret password..."
			required
		/>

		<Label for="confirm-password">Confirm Password</Label>
		<Input
			v-model="credentials.confirmPassword"
			type="password"
			placeholder="your super secret password, again"
			name="password"
			id="password"
			required
		/>

		<Button type="submit">Sign up</Button>
	</form>

	<Toaster rich-colors />
</template>
