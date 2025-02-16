import { ref } from "vue"

export function usePreviewImage() {
	const previewURL = ref("")
	const newImage = ref<File>()

	function previewImage(e: HTMLFormElement) {
		newImage.value = e.files[0]
		if (newImage.value) previewURL.value = URL.createObjectURL(newImage.value)
	}

	return { newImage, previewURL, previewImage }
}
