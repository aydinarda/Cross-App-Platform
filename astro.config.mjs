// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages: site = https://<user>.github.io , base = /<repo-name>
// Publish the repo under a space-free name (cross-app-platform); update the two
// lines below with your own username / repo name.
export default defineConfig({
  site: 'https://aydinarda.github.io',
  base: '/Cross-App-Platform',
});
