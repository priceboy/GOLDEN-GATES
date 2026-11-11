# Golden Gate website — technical audit

Audit date: 2026-11-11
Repository: `priceboy/GOLDEN-GATES`
Baseline: `main`
Scope: source-code review of the existing root-level `index.html`. No real-device browser session or production payment test has been performed yet.

## Executive summary

The current site is a single 78 KB HTML document containing page markup, a large embedded stylesheet, multiple inline scripts, donation UI, modals, music consent and third-party gallery/slider integrations. The current visual identity is recognisable, but the implementation has accumulated layout and interaction patterns that are fragile at narrow viewport sizes and difficult to maintain.

The redesign should preserve the organisation's story, approved imagery, project information and useful features while replacing the underlying structure in controlled stages.

## Findings

### High priority

1. **Mobile navigation semantics and contrast**
   - The hamburger is a clickable `div` with `aria-hidden="true"`, not a button.
   - It has no keyboard-operable semantics or expanded state.
   - Its bars are dark on the dark header, reducing contrast.
   - The mobile menu is absolutely positioned and depends on a CSS class toggled by JavaScript.

2. **Section sizing and overflow risk**
   - The global section rule uses `width: 100vw` and `margin-left: calc(-50vw + 50%)`.
   - This pattern can exceed the layout viewport and cause horizontal scrolling.
   - `body { overflow-x: hidden }` can conceal rather than solve the underlying overflow.

3. **JavaScript-dependent content visibility**
   - Sections are hidden with `display: none` unless they receive `.active`.
   - Navigation uses placeholder `href="#"` links and custom section switching.
   - If scripts fail, most primary content is unavailable; native browser navigation and deep-link semantics are weakened.

4. **Donation trust and correctness**
   - Payment routes, recipient names, account details and amounts are hard-coded in public HTML/JavaScript.
   - Some payment methods target international services while others are Cameroon mobile-money flows.
   - These values must be confirmed by an authorised foundation representative before migration or publication. Do not silently change, infer, or promote any account details.
   - The donation total is displayed in USD while Cameroon payment methods are also offered; currency, conversion and settlement expectations need explicit confirmation.
   - A client-side confirmation dialog is not a payment processor and must not imply that a payment has been received.

5. **Dialog accessibility**
   - Modals declare `role="dialog"` and `aria-modal`, but do not implement focus trapping, initial focus, focus restoration or a complete keyboard interaction model.

### Medium priority

6. **Gallery responsiveness**
   - `.gallery-grid` uses `repeat(auto-fill, minmax(300px, 1fr))`; this is too wide for some small phone content areas once section padding is included.
   - Gallery media uses a fixed 250px height without responsive aspect-ratio handling.

7. **Project and team grids**
   - Project cards use a 280px minimum track width.
   - The team grid switches to one column at 900px, potentially wasting tablet space.
   - Fixed media heights can crop important context differently across screen sizes.

8. **Floating controls**
   - Donation, social and music controls are fixed independently and can overlap one another or cover important content on short screens.
   - Their positions need safe-area and viewport-aware spacing.

9. **Third-party loading**
   - Swiper and GLightbox are loaded asynchronously from a CDN.
   - The `whenLib` helper listens for the window `load` event if a library is not immediately available. If the helper runs after `load` and the library is still unavailable, the callback can be missed.
   - Swiper initialisation catches and suppresses errors, making failures difficult to diagnose.

10. **Content and metadata consistency**
    - Metadata, headings and body copy use inconsistent terminology for the communities served.
    - The HTML contains old and current project descriptions/progress values that should be reconciled with the foundation's approved facts.
    - The document has duplicate favicon declarations and multiple embedded style/script blocks.

11. **Audio consent**
    - The welcome music prompt is intrusive as an initial interaction and can distract from the primary mission.
    - Music should be opt-in from a discreet control, never autoplayed on page load, and should respect reduced-motion/low-distraction preferences.

## Positive foundations to preserve

- A responsive viewport meta tag is present.
- Images generally have alt text and many project/gallery images use lazy loading.
- A reduced-motion media query exists.
- Donation totals use an `aria-live` region.
- Dialogs have accessible names.
- The site already has useful project, team, contact, gallery and story content.
- The repository already contains favicon, robots and sitemap files.

## Proposed target architecture

Keep the deployment lightweight and framework-free unless the repository's existing hosting workflow proves otherwise.

```text
index.html
assets/
  css/
    tokens.css
    base.css
    layout.css
    components.css
    sections.css
    responsive.css
  js/
    main.js
    navigation.js
    gallery.js
    donations.js
    dialogs.js
    media.js
  images/
    branding/
    home/
    projects/
    team/
    gallery/
docs/
  TECHNICAL_AUDIT.md
  REDESIGN_PLAN.md
```

The first extraction should be mechanical and behaviour-preserving. Redesigning the DOM and donation workflow should happen only after the old implementation is safely separated and tested.

## Verification plan

Test at 320, 375, 390, 430, 768, 1024 and 1440 CSS pixels, plus portrait/landscape and browser zoom. Verify:

- no horizontal overflow;
- navigation works with touch, keyboard and deep links;
- all content remains available without JavaScript where practical;
- project cards and gallery adapt without clipping;
- floating controls respect safe areas and do not cover content;
- donation calculations, project selection, currency labels and payment destinations are correct;
- dialogs manage focus and Escape behaviour;
- images have meaningful alt text, dimensions and fallbacks;
- external scripts fail gracefully;
- reduced-motion preference is respected;
- console has no uncaught errors.

## Limitations

This is a static source audit, not a completed browser/device audit. Production payment destinations and account ownership have not been independently verified. Those checks are release blockers for the donation experience.
