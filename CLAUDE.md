# CLAUDE.md

Marketing site for **M&M Specified Products LLC** (Michael "Mike" Moore, Woodbury MN), a
specification-driven manufacturers' rep for the underground water/wastewater utility industry.
Mike is the client; Zach (repo owner, `zach-mn`) builds and maintains the site.

## Stack

Plain static site. No build step, no package manager, no framework, no tests.

- `index.html` — the whole site, one page with anchor sections
- `styles.css` — all styles; design tokens are CSS custom properties in `:root`
- `script.js` — vanilla ES5 IIFE: mobile nav toggle, contact form → `mailto:` link
- `images/` — logos (`logo.png`, manufacturer and affiliation logos)
- `catalog/` — manufacturer PDFs, listed under each manufacturer in the Manufacturers section
- Font: Public Sans from Google Fonts (only external dependency)

To preview locally, open `index.html` directly or run `python -m http.server` in the repo root.

## Hosting and branches

GitHub Pages (legacy build, Jekyll) serves the **`master` branch root**.

Live URL: https://zachmn.com/mm-specified-products/ (HTTPS enforced; the custom domain comes from
the `zach-mn.github.io` user-site repo).

- **`master`** is live. Anything pushed there ships right away.
- The site uses the "Engineering Drawing meets Editorial" design (ink/paper/rust palette, SVG
  cross-section hero). It went live from the `redesign` branch via PR #1.

### Showing Mike a draft before going live

Pages serves only `master`, so a branch alone isn't viewable. A past redesign was shared by copying
the branch's `index.html`, `styles.css` and `script.js` into a `master:/preview/` folder, with asset
paths rewritten so they reuse master's images and PDFs:

```bash
mkdir -p preview
for f in index.html styles.css script.js; do
  git show <branch>:$f | sed 's#\(src\|href\)="images/#\1="../images/#g; s#\(src\|href\)="catalog/#\1="../catalog/#g' > preview/$f
done
```

Delete `preview/` once the branch is merged.

## Conventions

- Push to `master` or publish anything live only after confirming with Zach.
- Design: white page, one deep green (`--green`), Public Sans only, sentence case everywhere.
  No section numbers, eyebrow labels, monospace text or scroll animations. Keep it that way.
- Desktop sections use `.split`: heading and intro on the left, content on the right.
- To add a catalog PDF, add an `<li>` to that manufacturer's `.docs` list with title, document
  type and file size (`Product brochure, PDF, 1.8 MB`). A new manufacturer is a new `.maker` block.
- Responsive breakpoints in `styles.css`: 900 and 760px.
- Match the existing style: 4-space indent, ES5 JS (`var`, no modules), BEM-ish class names.
- The working tree is CRLF on Windows (`core.autocrlf=true`). There is no `.gitattributes`.

## Known gaps

- The contact form has no backend. `script.js` turns it into a `mailto:` link that opens the
  visitor's email app. A service like Formspree would let it send directly.
- `_config.yml` excludes this file from the Pages build. Add any other repo-only docs to its `exclude` list.
