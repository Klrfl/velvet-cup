<script setup lang="ts">
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { ref } from "vue"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "vue-sonner"

interface SignInCredentials {
	email: string
	password: string
}

const credentials = ref<SignInCredentials>({
	email: "",
	password: "",
})

async function handleSignIn(credentials: SignInCredentials) {
	const { error } = await authClient.signIn.email({
		email: credentials.email,
		password: credentials.password,
		rememberMe: true,
	})

	if (error) {
		if (import.meta.env.DEV) console.error(error)
		return toast.error(
			error.message ??
				"there was an error signin into your account. Please try again later."
		)
	}

	window.location.assign("/")
}
</script>

<template>
	<form class="grid gap-4" @submit.prevent="handleSignIn(credentials)">
		<Label for="email">Email</Label>
		<Input
			id="email"
			v-model="credentials.email"
			type="email"
			name="email"
			placeholder="email"
			required
		/>

		<Label for="password">Password</Label>
		<Input
			id="password"
			v-model="credentials.password"
			type="password"
			name="password"
			placeholder="your secret password"
			required
		/>

		<Button type="submit">Submit</Button>
	</form>

	<Toaster rich-colors />
</template>
