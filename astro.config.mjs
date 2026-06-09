// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Cambia con il dominio finale (utile per SEO e sitemap)
  site: 'https://il-ritorno-del-fedino.netlify.app',
  // Output statico: perfetto per Netlify/Vercel e velocissimo
  output: 'static',
});
