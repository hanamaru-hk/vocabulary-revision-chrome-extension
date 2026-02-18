import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    test: {
        globals: true,
        setupFiles: ['./src/setupTests.ts'],
    },
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
