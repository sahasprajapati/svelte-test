import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: '0.0.0.0',
		port: 3000
	},
	build: {
		target: 'es2015' // Compatible with Tizen OS 4
	}
});
