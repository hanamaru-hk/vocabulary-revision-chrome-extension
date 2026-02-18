
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        lib: {
            entry: resolve(__dirname, 'background.ts'),
            name: 'background',
            fileName: () => 'background.js',
            formats: ['cjs']
        },
        rollupOptions: {
            output: {
                extend: true,
            },
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, '../../'),
        },
    },
});
