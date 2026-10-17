# CLAUDE.md

Marketing site for **M&M Specified Products LLC** (Michael "Mike" Moore, Woodbury MN), a
specification-driven manufacturers' rep for the underground water/wastewater utility industry.
Mike is the client; Zach (repo owner, `zach-mn`) builds and maintains the site.

## Stack

Plain static site. No build step, no package manager, no framework, no tests.

- `index.html` — the whole site, one page with anchor sections
- `styles.css` — all styles; design tokens are CSS custom properties in `:root`
- `script.js` — vanilla ES5 IIFE: mobile nav, header border on scroll, photo gallery lightbox
  (`<dialog>`), contact form → pre-filled `mailto:`
- `images/` — logos (manufacturer and affiliation logos; `logo.png` is no longer used on the page)
- `images/photos/` — gallery photos (create it when the first photos arrive)
- `catalog/` — manufacturer PDFs linked from the Products section
- Fonts: Barlow, Barlow Semi Condensed, Barlow Condensed from Google Fonts (only external dependency)

To preview locally, open `index.html` directly or run `python -m http.server` in the repo root.

## Hosting and branches

GitHub Pages (legacy build, Jekyll) serves the **`master` branch root**.

Live URL: https://zachmn.com/mm-specified-products/ (HTTPS enforced; the custom domain comes from
the `zach-mn.github.io` user-site repo).

- **`master`** is live. Anything pushed there ships right away.
- `master` currently runs the "Engineering Drawing meets Editorial" design (ink/paper/rust palette,
  SVG cross-section hero). It went live from the `redesign` branch via PR #1.
- **`redesign-v3`** is the newest redesign: white page, deep blue `--brand`, Barlow type, and an
  APWA locate-color strip (blue water, green sewer, yellow gas, orange telecom) as the one accent.
  Five sections: About, Services, Products, Photos, Contact. The conventions below describe v3.
- **`redesign-v2`** is an unmerged, simpler redesign (white page, deep green, Public Sans, contact
  form → `mailto:`). Its own `CLAUDE.md` describes its conventions; follow that one when working there.

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
- The page is static HTML. To add a manufacturer, copy an `<li>` in `.makers`; to add a PDF, copy
  an `<li>` in `.downloads` and update the title, description and file size.
- To add a photo, put it in `images/photos/` (resize to ~2000px on the long edge first) and replace
  a `photo-empty` placeholder in `#gallery` with the snippet in the HTML comment above it. The
  first photo shows large; after 9 photos a "Show all photos" button appears (`GALLERY_LIMIT`).
  Photo links open the image file directly when JS or `<dialog>` is unavailable.
- Nav links and footer links list the same five sections. Keep them in sync.
- The only page-load motion is the hero locate strip drawing in; it is skipped under
  `prefers-reduced-motion`. There are no scroll animations.
- Responsive breakpoints in `styles.css`: 1100, 900, 768, 480px.
- Match the existing style: 4-space indent, ES5 JS (`var`, no modules), BEM-ish class names.
- The working tree is CRLF on Windows (`core.autocrlf=true`). There is no `.gitattributes`.

## Local-only files

Zach's working folder (`C:\Users\Zach\MM_Website`) holds client notes that are gitignored and never
published:

- `website-content-worksheet.txt` — the content questionnaire sent to Mike
- `WebsiteInformation6-5-26.docx.md` — Mike's answers (contact info, bio, stats, hero copy). This is
  the source of truth for site copy; its content is already on the live site.
- `catalog/BusinessImage5-11-26.png` — Mike's business graphic, intentionally removed from the repo

Anything committed under `catalog/` or `images/` becomes publicly downloadable once pushed, so
confirm with Zach before adding client files there.

## Known gaps

- The contact form opens a pre-filled email (`mailto:`) rather than sending. A real backend
  (Formspree or similar) would be needed to submit from the page.
- The photo gallery holds "Photo coming soon" placeholders until Mike sends photos.
- `_config.yml` excludes `CLAUDE.md` and `README.md` from the Pages build. Add any other repo-only
  docs to its `exclude` list.
