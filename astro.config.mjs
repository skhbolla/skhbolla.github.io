// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // Update this to your actual GitHub Pages URL.
  // Since this repo is username.github.io (a user-pages repo), it serves
  // from the domain root, so no `base` path is needed. If you ever move
  // this to a regular project repo instead, you'll need to add
  // base: '/repo-name' here.
  site: 'https://skhbolla.github.io',

  integrations: [mdx()],

  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      wrap: true,
    },
  },

  // Both fonts (Departure Mono + Arizona, once added) are plain static
  // files in public/fonts/, wired up via @font-face in
  // src/styles/tokens.css. No Fonts API, no provider, no build-time font
  // processing — what's in public/fonts/ is byte-for-byte what ships.
});
