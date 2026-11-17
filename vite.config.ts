import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Pour GitHub Pages, le site est servi sous /<nom-du-dépôt>/ : on passe BASE_URL au build.
  base: process.env.BASE_URL ?? '/',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Web components de DSFR Chart
          isCustomElement: (tag) => tag === 'bar-chart',
        },
      },
    }),
  ],
})
