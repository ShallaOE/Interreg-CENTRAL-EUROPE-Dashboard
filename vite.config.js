import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change base to match your GitHub repo name
// e.g. repo is github.com/yourname/interreg-dashboard → base: '/interreg-dashboard/'
export default defineConfig({
  plugins: [react()],
  base: '/Interreg-CENTRAL-EUROPE-Dashboard/',
})
