# CLAUDE.md

Marketing site for **M&M Specified Products LLC** (Michael "Mike" Moore, Woodbury MN), a
specification-driven manufacturers' rep for the underground water/wastewater utility industry.
Mike is the client; Zach (repo owner, `zach-mn`) builds and maintains the site.

## Stack

Plain static site. No build step, no package manager, no framework, no tests.

- `index.html` — the whole site, one page with anchor sections
- `styles.css` — all styles; design tokens are CSS custom properties in `:root`
- `script.js` — vanilla ES5 IIFE: mobile nav, header scroll state, scroll-reveal, stat counters
- `images/` — logos (`logo.png`, manufacturer and affiliation logos)
- `catalog/` — manufacturer PDFs linked from the Product Catalog section
- Fonts: IBM Plex Serif / Sans / Mono from Google Fonts (only external dependency)

To preview locally, open `index.html` directly or run `python -m http.server` in the repo root.

## Hosting and branches

GitHub Pages (legacy build, Jekyll) serves the **`master` branch root**.

| URL | Source |
| --- | --- |
| https://zachmn.com/mm-specified-products/ | `master` root: live site (teal/charcoal design) |
| https://zachmn.com/mm-specified-products/preview/ | `master:/preview/`: snapshot of `redesign` for Mike to review |

- **`master`** is live. Anything pushed there ships right away.
- **`redesign`** holds the new "Engineering Drawing meets Editorial" design (ink/paper/rust palette,
  SVG cross-section hero). Its files sit at the repo root, the same layout as `master`.
- `master/preview/` contains copies of `redesign`'s `index.html`, `styles.css` and `script.js`,
  with `images/` → `../images/` and `catalog/` → `../catalog/` so it reuses master's assets.
  It contains no images or PDFs of its own.

### Refreshing /preview/ after changing `redesign`

Run this from a `master` checkout in Git Bash, after committing on `redesign`:

```bash
mkdir -p preview
for f in index.html styles.css script.js; do
  git show redesign:$f | sed 's#\(src\|href\)="images/#\1="../images/#g; s#\(src\|href\)="catalog/#\1="../catalog/#g' > preview/$f
done
```

Any new image or PDF that `redesign` uses must also exist in master's `images/` or `catalog/`.
Without it, the preview link breaks.

### Going live with the redesign

Merge `redesign` into `master` and delete `preview/`. Ask before you do this, because it changes
the public site.

## Conventions

- Push to `master` or publish anything live only after confirming with Zach.
- The page is static HTML. To add a manufacturer or catalog PDF, copy an existing card in
  `index.html` and renumber it: `PRT/0N` tags, `catalog-num`, and `data-reveal-delay` steps
  (manufacturers +75ms, catalog +40ms).
- Sections are numbered 01–06 in the nav (`nav-num`) and in each `section-num`. Keep the two in sync.
- Scroll-reveal: `[data-reveal]` elements stay visible unless JS adds `html.js-ready`, so the
  content still shows without JS. Keep that fallback. `prefers-reduced-motion` is respected in CSS.
- Responsive breakpoints in `styles.css`: 1100, 900, 768, 480px.
- Match the existing style: 4-space indent, ES5 JS (`var`, no modules), BEM-ish class names.
- The working tree is CRLF on Windows (`core.autocrlf=true`). There is no `.gitattributes`.

## Known gaps

- The contact form is a placeholder (`onsubmit` → `alert`). It has no backend yet; Formspree or
  similar would be needed.
- `images/BusinessImage5-11-26.png` (~1.9 MB) isn't referenced anywhere.
- `_config.yml` excludes this file from the Pages build. Add any other repo-only docs to its `exclude` list.
