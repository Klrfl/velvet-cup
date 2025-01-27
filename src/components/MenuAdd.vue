<script setup lang="ts">
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const emit = defineEmits(["menuAdded"])

async function handleAddMenu(form: HTMLFormElement) {
	const formData = new FormData(form)

	const res = await fetch(`/api/admin/menu/`, {
		method: "POST",
		body: formData,
	})

	const { message, data } = await res.json()

	if (res.status === 200) {
		// TODO: do something
		emit("menuAdded", data)
	}
}
</script>

<template>
	<form
		@submit.prevent="(e) => handleAddMenu(e.currentTarget as HTMLFormElement)"
		class="grid gap-2 max-w-xl"
	>
		<Label for="menu_name">Nama</Label>
		<Input type="text" name="menu_name" placeholder="nama" required />

		<Label for="menu_description">Deskripsi</Label>
		<Textarea
			placeholder="deskripsi"
			name="menu_description"
			required
		></Textarea>

		<Button type="submit">tambahkan menu baru</Button>
	</form>
</template>
