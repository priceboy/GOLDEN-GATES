const track = document.getElementById("story-track");
const status = document.getElementById("story-status");
const controls = document.querySelectorAll("[data-story-direction]");
if (track) {
  const cards = [...track.querySelectorAll(".story-card")];
  const updateStatus = () => {
    if (!status || !cards.length) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0, distance = Infinity;
    cards.forEach((card, index) => {
      const midpoint = card.offsetLeft + card.offsetWidth / 2;
      const nextDistance = Math.abs(midpoint - center);
      if (nextDistance < distance) { distance = nextDistance; nearest = index; }
    });
    status.textContent = `Chapter ${nearest + 1} of ${cards.length} · Swipe or scroll to explore`;
  };
  controls.forEach(button => button.addEventListener("click", () => {
    const direction = Number(button.dataset.storyDirection) || 1;
    const card = cards[0];
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }));
  track.addEventListener("scroll", updateStatus, { passive: true });
  window.addEventListener("resize", updateStatus, { passive: true });
  updateStatus();
}
