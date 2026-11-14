# Content recovery and modular structure

## Story content restored

The eight narrative chapters below were recovered from the unchanged `main` branch and reintroduced into the redesigned homepage. In panel mode it is a fade deck (one chapter at a time) so it does not nest a second horizontal scroller; without JavaScript the normal scrollable story remains. Original chapter wording and image references were retained.

1. **The Gate of Hope** — In 2023, a dream took its first breath. Under the vision of our founder, our dedicated team set out on a mission:
   - Image: https://i.imgur.com/DolIePP.png
2. **The First Step of Courage** — On our first year, 100 parents found the courage to entrust their precious children to us. Fear of the unknown weighed heavily on their hearts, yet their bravery planted the first seeds of hope in our classrooms.
   - Image: https://i.postimg.cc/0jnZRzdw/IMG-20251120-WA0023.jpg
3. **Little Hands, Big Dreams** — Every child who walks through our doors carries a story of resilience. Tiny hands clutched to pencils as big as the dreams sparkling in their eyes. Each smile, question, reminds us why every effort matters.
   - Image: https://i.postimg.cc/5NkxnNgf/IMG-20251025-WA0003.jpg
4. **Growing Together** — With each passing day, our classrooms blossomed with curiosity. Children who once hesitated now raised their voices, eager to explore, to ask, to understand. Their courage became our inspiration.
   - Image: https://i.postimg.cc/y8m9Djj1/IMG-20251119-WA0014.jpg
5. **Triumphs and Tears** — There were tears of struggle and joy of discovery. Lessons learned weren’t only in books—they were in courage, patience, and the quiet victories of children who had once been denied the chance to learn.
   - Image: https://i.postimg.cc/nL6JB0WZ/IMG-20251025-WA0013.jpg
6. **Milestones Achieved** — By the end of our first year, we had not only taught lessons, but nurtured souls. Over 180 children had found a safe haven, a place where knowledge met care, and dreams could take their first flight.
   - Image: https://i.postimg.cc/tRdKkXLx/Untitled-design-(5).png
7. **Gratitude in Every Step** — Every smile captured in these photo tells a story of trust, perseverance, and love. Every parent who believed, every child who dared, brought us one step closer to the mission we hold dear.
   - Image: https://i.postimg.cc/DZctCyDQ/IMG-20251120-WA0007.jpg
8. **The Journey Ahead** — Golden Gate is more than walls and classrooms. It is hope made tangible, opportunity made real. Every picture, every moment, is a reminder: together, we can transform lives, one child at a time.
   - Image: https://i.imgur.com/YToJQBb.jpg

## Frontend modules

- `assets/css/tokens.css`: design tokens.
- `assets/css/base.css`: document defaults and reset.
- `assets/css/layout.css`: page shell, header, navigation and footer layout.
- `assets/css/components.css`: reusable buttons, cards, form controls and dialogs.
- `assets/css/sections.css`: page-section styling, including the restored story sequence.
- `assets/css/responsive.css`: breakpoint and reduced-motion rules.
- `assets/css/panels.css`: desktop horizontal panel shell, compact panel layouts and fade transitions.
- `assets/js/navigation.js`: responsive navigation, horizontal panel navigation and scroll position.
- `assets/js/donations.js`: project selection, contribution calculations and payment-instruction dialog.
- `assets/js/data/projects.js`: project task and price data.
- `assets/js/data/payment.js`: payment configuration, gated behind a verification flag.
- `assets/js/story-carousel.js`: story controls, fade/scroll behaviour and chapter status.
- `assets/js/lightbox.js`: accessible gallery viewer for images and video.
- `assets/js/team.js`: expands and collapses the About team biographies.
- `assets/js/main.js`: application entry point and module imports.
- `assets/js/site.js`: small browser entry point imported by the HTML document.

## Important publication safeguards

The existing payment recipients, bank details, project completion percentages and impact claims were not independently verified as part of this code migration. The redesign retains the existing donation workflow and content for continuity, but those values must be confirmed by an authorised foundation representative before public promotion. This commit does not connect a payment processor or confirm payment receipt.

## Validation status

This is a static-source implementation. It still needs a real browser preview and viewport checks at 320, 375, 390, 430, 768, 1024 and 1440 CSS pixels, plus keyboard and reduced-motion checks. No claim of production payment verification or device testing is made.
