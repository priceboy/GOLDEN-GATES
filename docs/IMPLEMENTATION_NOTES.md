# Redesign implementation notes

Date: 2026-11-14
Branch: `redesign/modular-rebuild`

## What changed

### Navigation and layout

- Removed the full-page horizontal panel shell (`horizontal-panels.css` and the
  panel logic in `navigation.js`). The site is a normal vertical document with
  native anchor links again.
- Removed the `site.css` `@import` chain. The page now links the six stylesheets
  directly, so they load in parallel instead of one after another.
- Added `?v=20261114c` cache keys to stylesheet and module URLs. Update the
  version string when deploying CSS or JS changes.

### JavaScript

- Added `assets/js/data/projects.js` with the project task prices carried over
  from `main`. This fixes the `ReferenceError`/`TypeError` that broke the
  donation panel, the story carousel and the footer year.
- Renamed the data import to `PROJECTS` so it cannot collide with the
  `<section id="projects">` element (which creates a global `window.projects`).
- Rewrote `donations.js` with guarded DOM access, DOM-built option rows,
  `aria-live` totals, copy buttons for account numbers, a safe fallback for
  unknown methods, and dialog cleanup after opening a payment link.
- Added `assets/js/lightbox.js`: a small native `<dialog>` gallery with
  previous/next, keyboard arrows, image and video support, and a working
  no-JavaScript fallback (links open the media directly).
- Story autoplay now runs only while the story section is on screen
  (`IntersectionObserver`), respects reduced motion, and no longer uses
  `aria-pressed` on a button whose label already changes.
- Removed the resize handler that forced the browser back to the nearest panel.

### Content and trust

- Removed the unverified founder name ("Romanus Mbapah"). The founder card now
  uses the original copy from `main`.
- Restored the director and system administrator quotes from `main` verbatim.
  The redesign had paraphrased them.
- **Payment details are gated.** `assets/js/data/payment.js` has
  `verified: false` and empty account fields. The donation dialog now tells
  visitors that instructions are awaiting confirmation and points them to
  WhatsApp instead of publishing unverified account numbers, recipient names or
  Cash App/Venmo handles.
- Kept the inherited progress percentages, with the existing data note asking
  the foundation to review them. No figures were invented.

### Our Heroes and UX polish

- Added the `#heroes` spotlight between "Our story" and "Support": one
  placeholder partner card (monogram, type label, name and one-sentence
  description) plus a "Become a partner" link. The markup is static, needs no
  JavaScript, and includes replacement instructions for an organisation logo or
  an individual monogram.
- Added "Our Heroes" to the primary navigation. The mobile-nav breakpoint moved
  from 900 px to 1040 px so the ten-item bar cannot overflow; verified at
  320–1440 px with no horizontal overflow. The open mobile menu scrolls
  internally on short viewports.
- The floating "Support" CTA now hides while the `#donate` section is on screen,
  so the ask is not duplicated in the same viewport.
- Section spacing uses a `--section-space` clamp, the hero height is capped at
  `min(680px, 92vh)` (and 600/630 px on smaller screens), and body copy uses the
  `--measure` token.
- Hero cards support both organisations (`<img>` in `.hero-media`, `alt=""`
  because the name is adjacent) and individuals (initials monogram, `.hero-type`
  set to "Supporter"). Publish only with written consent.

### Horizontal section panels (desktop)

- At 1025 px and above, `html.panels` turns `#main` into a horizontal,
  scroll-snapped track: one full-height section per viewport. Vertical scrolling
  inside a panel only happens when its content exceeds the screen.
- Sections fade and slide in when active (`.container` opacity 0.35 → 1 plus a
  14 px lift). Reduced-motion visitors get the state change without the motion.
- Navigation supports mouse wheel (a vertical wheel advances panels unless the
  panel is mid-scroll), trackpad horizontal scrolling, ArrowLeft/ArrowRight,
  in-page links, hash deep links and browser back/forward via `pushState`.
- Only the active panel is tabbable: inactive sections are `inert` and
  `aria-hidden`. A thin gold progress bar shows the current position.
- The floating Support CTA is hidden in panel mode; Support remains in the nav.
- The story carousel becomes a fade deck in panel mode (one card visible,
  arrows/keys/swipe, no nested horizontal scroller). Mobile keeps the horizontal
  scroll-snap track.
- Phones/tablets below 1025 px and no-JavaScript visits stay as the normal
  vertical document; the `panels` class is never applied.
- Panel content is compacted (image-left project rows, shorter gallery rows,
  tighter donation form). At 1440×900, 1280×720 and 1025×768 every section fits
  without internal scrolling; at 1280×600 the tallest panels scroll internally.

### Media

- Downloaded all 31 remote images into `assets/images/` and re-encoded them to
  JPEG (max 1600 px, quality 82; hero 1920 px). Total size dropped from
  ~15.2 MB to ~4.1 MB.
- The site no longer hotlinks imgur or postimg. In the browser, imgur returned
  403 for 5 project images and the hero, which left the hero as a flat navy
  block; this is fixed.
- Added a hero preload and kept lazy loading for below-the-fold images.

### Accessibility, SEO and performance

- Fixed low-contrast text: new `--gold-ink` (#7c5f26) for gold text on light
  backgrounds; muted text darkened to #5d6b70. Lighthouse accessibility is now
  100 (previously the audit only evaluated the visible panel and missed these).
- Added a real `<footer>` landmark outside `<main>`, `tabindex="-1"` on
  `<main>`, focus transfer to the selected section, and focus styles for
  gallery links.
- Added Open Graph, Twitter card, canonical, JSON-LD and an apple-touch icon.
- Added a no-JavaScript navigation fallback (`html.no-js`), a donation
  `<noscript>` notice, and print styles.
- Lighthouse (mobile, local): Accessibility 100, Best Practices 100, SEO 100.

### Deployment

- `deploy.yml` now excludes `.git/`, `.github/`, `docs/`, `.gitignore` and the
  existing log files, so internal documents and repository metadata are not
  uploaded to the web root.
- Removed the unreferenced `huo.mp3` (2.5 MB) and the unused `site.css` and
  `horizontal-panels.css`.

## Before this branch goes to production

These are content/trust questions, not code bugs. Do not merge until they are
answered by an authorised foundation representative.

1. **Payment methods.** Confirm which methods are authorised, and every account
   name, number and handle. Fill them into `assets/js/data/payment.js`, set
   `verified: true`, and test each method.
2. **Founder and team.** Confirm the founder's name if it should be published,
   and confirm the restored quotes are accurate.
3. **Progress figures.** Confirm the percentages and targets shown on the nine
   project cards.
4. **Photographs.** Confirm publication consent for identifiable children and
   staff, especially the gallery.
5. **Currency.** The panel says USD while MTN and Orange Money are local
   XAF flows. Confirm whether to show both and who maintains any conversion.
6. **Domain assets.** The Open Graph image uses
   `https://goldengate-foumbot.org/assets/images/hero-gate-of-hope.jpg`; verify
   the production URL resolves once deployed.
7. **Our Heroes.** Replace the placeholder name, type and sentence; confirm the
   hero approves the logo/name/sentence and that consent is on file. The
   placeholder is marked with a comment in `index.html`.

## Verification performed

- Local server (`python -m http.server`) at 624 px and browser console check:
  no errors, no broken images, all 36 images loaded, no duplicate IDs, all nav
  anchors resolve.
- Donation flow: project switch, task checkbox, custom amount, total, dialog.
- Lightbox: image, next, video embed, close.
- Mobile menu: open/close, `aria-expanded`, closes on link selection.
- Story: autoplay advances only when visible, pause/play, arrows.
- Responsive audit in an iframe at 320, 375, 430, 768, 900, 1000, 1024, 1041,
  1180 and 1440 px: no horizontal overflow, nav collapses at 1040 px, header
  never overflows, heroes switch to two columns above 1024 px.
- Horizontal panel audit at 1440×900, 1280×720, 1025×768 and 1280×600: no
  horizontal overflow; projects, story, gallery, about, donate, mission and
  contact fit at the first three sizes; 1280×600 has small internal scrolling.
- Panel interactions: nav click, wheel, ArrowRight, hash load, browser back,
  progress bar, `inert` state, and story fade all verified in a 1440 px frame.
- Lighthouse: 100 accessibility / 100 best practices / 100 SEO.
