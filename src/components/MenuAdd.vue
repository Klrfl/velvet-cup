<script setup lang="ts">
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
	>
		<input type="text" placeholder="nama" name="menu_name" required />
		<textarea placeholder="nama" name="menu_description" required></textarea>

		<button type="submit">tambahkan menu baru</button>
	</form>
</template>
