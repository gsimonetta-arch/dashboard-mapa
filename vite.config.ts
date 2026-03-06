import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // MapLibre GL v5 uses Web Workers internally. Vite's dependency pre-bundling
  // breaks the worker because it rewrites module boundaries in a way that
  // leaves internal references undefined (error: 'ht is not defined').
  // Excluding maplibre-gl from optimization preserves the original ESM structure.
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
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
