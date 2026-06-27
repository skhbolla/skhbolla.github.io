import { defineConfig } from 'astro/config';

import astroExpressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  site: 'https://skhbolla.github.io',

  integrations: [
    astroExpressiveCode({
      themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
      themes: ['github-light', 'github-dark'],
      useThemedScrollbars: false,
      styleOverrides: {
        borderRadius: 'var(--radius-lg)',
        borderWidth: 'var(--border-thin)',
        borderColor: 'var(--base03)',
        codeBackground: 'var(--base02)',
        uiFontFamily: 'var(--font-label)',
        uiFontSize: 'var(--text-xs)',
        codeFontFamily: 'var(--font-code)',
        frames: {
          frameBoxShadowCssValue: 'none',
          editorTabBarBackground: 'var(--base01)',
          editorActiveTabBackground: 'var(--base02)',
          editorActiveTabBorderColor: 'var(--base0D)',
          terminalTitlebarBackground: 'var(--base01)',
          terminalBackground: 'var(--base02)'
        }
      }
    })
  ],

  // Both fonts (Departure Mono + Arizona, once added) are plain static
  // files in public/fonts/, wired up via @font-face in
  // src/styles/tokens.css. No Fonts API, no provider, no build-time font
  // processing — what's in public/fonts/ is byte-for-byte what ships.
});
