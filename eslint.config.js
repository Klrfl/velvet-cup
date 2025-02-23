import pluginAstro from "eslint-plugin-astro"
import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import pluginVue from "eslint-plugin-vue"
import vueParser from "vue-eslint-parser"
import tsParser from "@typescript-eslint/parser"
import eslintConfigPrettier from "eslint-config-prettier"

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
	{
		ignores: [
			"**/*.d.ts",
			".astro",
			"src/database/seeds/*.ts",
			"src/database/migrations/*.ts",

			// ignore components from shadcn-vue
			"src/components/ui/*",
		],
	},
	pluginJs.configs.recommended,

	// Allow triple-slash references in `*.d.ts` files.
	{
		files: ["**/*.d.ts"],
		rules: {
			"@typescript-eslint/triple-slash-reference": "off",
		},
	},

	//Astro
	...pluginAstro.configs.recommended,

	{
		extends: [
			pluginJs.configs.recommended,
			...tseslint.configs.recommended,
			...pluginVue.configs["flat/recommended"],
		],
		files: ["*.vue", "**/*.vue"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: globals.browser,
			parser: vueParser,
			parserOptions: {
				parser: tsParser,
			},
		},
	},
	eslintConfigPrettier
)
