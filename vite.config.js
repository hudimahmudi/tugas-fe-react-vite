import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Import plugin tailwind

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Masukkan ke sini
  ],
})