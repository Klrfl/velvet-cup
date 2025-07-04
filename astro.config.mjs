// @ts-check
import { defineConfig } from "astro/config"

import node from "@astrojs/node"

import vue from "@astrojs/vue"

import tailwind from "@astrojs/tailwind"

// https://astro.build/config
export default defineConfig({
	output: "server",

	adapter: node({
		mode: "standalone",
	}),

	integrations: [vue(), tailwind({ applyBaseStyles: false })],
	site: "https://velvet-cup.munthe.dev",
})
