# Golden Gate redesign — implementation plan

## Approved direction

- Complete visual reimagining.
- Modular rebuild.
- Preserve the organisation's identity, mission, useful copy, approved photographs and project history.
- Keep the site lightweight and framework-free for now.
- Work on `redesign/modular-rebuild`; do not modify `main` until the preview is reviewed and approved.

## Design principles

1. **Human and credible:** authentic school/community photography, clear impact evidence and direct language.
2. **Editorial rather than generic:** strong typography, calm whitespace, deliberate hierarchy and restrained motion.
3. **Mobile-first:** layouts start at narrow phones and scale up; no fixed-width cards or viewport-width hacks.
4. **Accessible by default:** semantic landmarks, real buttons and links, visible focus, keyboard support, reduced-motion support and adequate contrast.
5. **Trustworthy giving:** no unverified payment details, misleading progress figures or implied payment processing.
6. **Fast and resilient:** optimise images, minimise third-party dependencies and keep meaningful content available if enhancements fail.

## Visual system

- Deep navy: `#092B45`
- Warm ivory: `#F5F0E6`
- Muted gold: `#C9A45C`
- Forest accent: `#263B32`
- Display type: Fraunces (or a robust serif fallback)
- Body type: Inter (or system sans-serif fallback)
- Consistent spacing, content widths, radii, borders and button variants defined as CSS custom properties.

## Site information architecture

1. Home — mission-led hero, clear calls to action, impact snapshot and introduction.
2. Our work / impact — project cards, status and transparent progress.
3. Support — project-specific giving and verified payment instructions.
4. About — origin story, mission, vision, values, founder and team.
5. Gallery — responsive image/video gallery with accessible lightbox.
6. Contact — official contact information, location and social channels.

Use semantic sections and native anchor navigation. The site may remain a single-page experience initially; navigation should not hide every other section with JavaScript.

## Delivery stages

### Stage 1 — Protect and prepare
- Create the redesign branch.
- Record source audit and migration plan.
- Inventory all existing copy, imagery, project data, contact channels and donation methods.
- Identify repository hosting/deployment conventions.

### Stage 2 — Modular extraction
- Move CSS and JavaScript out of the HTML without changing behaviour.
- Split styles/scripts by responsibility.
- Add lint/validation checks where compatible with the current hosting setup.
- Keep a known-good checkpoint before changing page structure.

### Stage 3 — Design system and homepage
- Implement design tokens and reusable layout/components.
- Replace the header/navigation with accessible responsive controls.
- Build the new home hero and impact overview.
- Review at mobile and desktop widths before migrating other sections.

### Stage 4 — Content and features
- Rebuild projects, donations, About, Gallery and Contact.
- Migrate content and approved image references.
- Rework dialogs and gallery interactions accessibly.
- Do not publish payment data until confirmed by the foundation.

### Stage 5 — Quality
- Optimise images and third-party loading.
- Test keyboard, screen reader basics, contrast and reduced motion.
- Test all required viewport widths and check for overflow.
- Verify links, metadata and SEO.

### Stage 6 — Preview and release
- Deploy a preview from the redesign branch.
- Review all pages and donation instructions with the user/foundation.
- Fix regressions.
- Open a pull request into `main`; merge only after explicit approval.

## Release blockers / facts requiring confirmation

- Which payment methods are officially authorised for public use?
- Are the displayed recipient/account names and numbers current and approved?
- Should amounts be shown in USD, XAF, or both? If both, who maintains the conversion rate?
- Which current project completion percentages and fundraising targets are approved?
- Which contact email, phone/WhatsApp and location details are official?
- Which images may be published, and are permissions/consent in place for identifiable children?

## Working agreement

Preserve the original site on `main`. Do not delete source assets, change donation recipients, invent impact numbers or publish unverified claims. Each migration should be reviewable and reversible.
