// The story is a vertical, page-flow sequence. This file intentionally
// contains no horizontal carousel or autoplay behavior.
const story = document.querySelector(".story-section");
if (story) {
  story.querySelectorAll(".story-card").forEach((card, index, cards) => {
    card.setAttribute("aria-label", `Chapter ${index + 1} of ${cards.length}`);
  });
}
