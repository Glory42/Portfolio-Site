// @ts-check
import { defineConfig } from 'astro/config';
import 'dotenv/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.GITHUB_TOKEN': JSON.stringify(process.env.GITHUB_TOKEN),
    }
  }
});