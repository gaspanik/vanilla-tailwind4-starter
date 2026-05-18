import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { glob } from 'glob'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const files = glob.sync('*.html')
const input = Object.fromEntries(
  files.map((file) => [
    path.basename(file, '.html'),
    path.resolve(__dirname, file),
  ]),
)

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
    build: {
    rollupOptions: {
      input,
    },
  },
  // path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // base path for deploying to a subdirectory
  // base: './',
})
