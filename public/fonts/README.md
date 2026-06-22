# Fonts

Both fonts are plain static files, served as-is from this folder — no
build-time processing, no third-party font package, no API. What's in this
folder is exactly what ships to the browser.

- `DepartureMono-Regular.woff2` — OFL-1.1, see `DepartureMono-LICENSE.txt`.
- `Newsreader-Variable.woff2` + `Newsreader-Italic-Variable.woff2` — the
  body/serif typeface. OFL-1.1, see `Newsreader-LICENSE.txt`. These are
  variable fonts (weight 200-800, plus an optical-size axis that adjusts
  letterforms automatically at different text sizes) — that's why it's
  two files total instead of six separate weight/style statics.
