import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: "l-systems",

  exclude: ["svelte-codemirror-editor", "codemirror", "@codemirror/language-javascript" /* ... */],
  build: {
    minify:false,
  },

})
