import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [tanstackRouter(), viteReact(), tailwindcss()],
})
