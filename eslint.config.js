import eslintPluginAstro from "eslint-plugin-astro"
import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
	{
		ignores: [
			".astro",
			"src/database/seeds/*.ts",
			"src/database/migrations/*.ts",
		],
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	//
	// Allow triple-slash references in `*.d.ts` files.
	{
		files: ["**/*.d.ts"],
		rules: {
			"@typescript-eslint/triple-slash-reference": "off",
		},
	},
	...eslintPluginAstro.configs.recommended,
	{
		files: ["**/*.{js,ts,mjs,mts}"],
		languageOptions: {
			globals: globals.browser,
		},
	}
)
