# Blog

A two-section blog — mechanical sympathy and DSA — built with Astro,
content collections, and a CSS-variable theme system. Deploys to GitHub
Pages.

## Setup

```bash
npm install
npm run dev      # localhost:4321
npm run build    # outputs to dist/
npm run preview  # serve the built output locally
```

Before deploying, update `site` in `astro.config.mjs` to your actual
`https://your-username.github.io` URL — it's currently a placeholder.

## Fonts

Body text is set in **Newsreader** (open-source, self-hosted variable font)
and labels/code in **Departure Mono**.

## Structure

- `src/content/dsa/` and `src/content/mech-sympathy/` — your posts, as
  `.md` or `.mdx` (mix freely — see the one `.mdx` sample post for how to
  embed a component in prose).
- `src/content.config.ts` — collection schemas. Add a frontmatter field
  here before using it in a post, or the build will fail with a clear
  validation error.
- `src/layouts/BaseLayout.astro` — head, fonts, theme script, shared
  header. `PostLayout.astro` wraps individual posts on top of it.
- `src/styles/tokens.css` — fonts, spacing, type scale (no color).
- `src/styles/themes.css` — color tokens per `[data-theme]`. Add a new
  theme by adding a block here and one entry in
  `src/components/ThemeToggle.astro`'s `themes` array.
- `src/styles/global.css` — base styles, prose typography, and the
  text-selection highlight effect.

## Writing a post

Drop a `.md` (or `.mdx`, if it needs an embedded component) file into
either `src/content/dsa/` or `src/content/mech-sympathy/` with this
frontmatter:

```md
---
title: "Post title"
description: "One sentence, used in listings and RSS."
date: 2026-06-21
tags: ["optional", "tags"]
---

Your content here.
```

It'll show up in that section's listing and RSS feed automatically — no
other file needs to change. Set `draft: true` to keep a post out of both
until it's ready.

## Deploying

Push to `main`. The existing `.github/workflows/deploy.yml` builds and
publishes via GitHub Actions — make sure repo Settings → Pages → Source is
set to "GitHub Actions."
