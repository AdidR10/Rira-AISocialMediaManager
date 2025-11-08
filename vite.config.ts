import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	ssr: {
		noExternal: [],
		external: [
			'@libsql/linux-x64-gnu',
			'@libsql/darwin-x64',
			'@libsql/darwin-arm64',
			'@libsql/win32-x64-msvc'
		]
	},
	build: {
		rollupOptions: {
			external: [
				'@libsql/linux-x64-gnu',
				'@libsql/darwin-x64',
				'@libsql/darwin-arm64',
				'@libsql/win32-x64-msvc'
			]
		}
	}
});
