import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react({
			jsxImportSource: "@emotion/react",
			babel: {
				plugins: ["@emotion/babel-plugin"]
			}
		})
	],
	css: {
		devSourcemap: true,
	},
	build: {
		sourcemap: true,
		watch: {
			include: ["src", "package.json", "tsconfig.json"]
		},
		minify: false,
	},
	assetsInclude: [
		"assets/**/*.{wav,svg}"
	]
})
