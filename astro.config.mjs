// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://thoughts.miguelintech.com',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'always',
  },
});
