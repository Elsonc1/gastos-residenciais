import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite é o bundler do projeto. O servidor de desenvolvimento roda na porta 5173.
// A API .NET deve estar rodando na porta 5000 (configurado em launchSettings.json).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
