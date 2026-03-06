import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Treat .geojson files as JSON modules so they get bundled into the JS
    // bundle instead of being fetched at runtime (avoids nginx serving issues).
    {
      name: 'geojson',
      transform(code, id) {
        if (id.endsWith('.geojson')) {
          return { code: `export default ${code}`, map: null }
        }
      },
    },
  ],
})
