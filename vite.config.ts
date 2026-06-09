import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path must match the GitHub repository name for project Pages.
// Served at https://<user>.github.io/rcTrackTimer/
export default defineConfig({
  plugins: [react()],
  base: '/rcTrackTimer/',
})
