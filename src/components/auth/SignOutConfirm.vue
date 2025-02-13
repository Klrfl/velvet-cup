<script setup lang="ts">
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Toaster } from "@/components/ui/sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

import { toast } from "vue-sonner"
import { computed, ref } from "vue"

const confirmText = ref("")
const hasConfirmed = computed(() => confirmText.value === "SIGN OUT")

async function handleSignOut() {
	const { error } = await authClient.signOut()

	if (!hasConfirmed) {
		return
	}

	if (error) {
		if (import.meta.env.DEV) console.error(error)

		toast.error(
			error.message ?? "there was an error when signin out. Try again later."
		)
	}

	window.location.assign("/")
}
</script>

<template>
	<Dialog>
		<DialogTrigger as-child>
			<Button variant="destructive">Sign out</Button>
		</DialogTrigger>

		<DialogContent>
			<form @submit.prevent="handleSignOut" class="grid gap-4">
				<Label for="confirm"
					>Confirm that you are really signing out by typing
					<span class="font-bold">SIGN OUT</span> in all caps.</Label
				>
				<Input
					type="text"
					id="confirm"
					name="confirm"
					v-model="confirmText"
					required
				/>

				<Button type="submit" :disabled="!hasConfirmed" variant="destructive"
					>Sign out</Button
				>
			</form>
		</DialogContent>
	</Dialog>

	<Toaster rich-colors />
</template>
