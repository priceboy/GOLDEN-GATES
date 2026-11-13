const track = document.getElementById("story-track");
const status = document.getElementById("story-status");
const root = track?.closest(".story-section");
const controls = root?.querySelectorAll("[data-story-direction]") ?? [];
const autoplayToggle = root?.querySelector("[data-story-autoplay-toggle]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (track && root) {
  const cards = [...track.querySelectorAll(".story-card")];
  const interval = 6000;
  let activeIndex = 0;
  let autoplayTimer = null;
  let interactionTimer = null;
  let hovered = false;
  let focused = false;
  let interacting = false;
  let userPaused = false;

  cards.forEach((card, index) => {
    card.setAttribute("role", "group");
    card.setAttribute("aria-roledescription", "slide");
    card.setAttribute("aria-label", `Chapter ${index + 1} of ${cards.length}`);
  });

  const isBlocked = () =>
    userPaused || hovered || focused || interacting ||
    document.hidden || reducedMotion.matches;

  const clearAutoplay = () => {
    if (autoplayTimer !== null) window.clearTimeout(autoplayTimer);
    autoplayTimer = null;
  };

  const scheduleAutoplay = () => {
    clearAutoplay();
    if (!cards.length || isBlocked()) return;
    autoplayTimer = window.setTimeout(() => {
      goTo(activeIndex + 1, true);
      scheduleAutoplay();
    }, interval);
  };

  const updateStatus = () => {
    if (!cards.length) return;
    const currentLeft = track.scrollLeft + cards[0].offsetLeft;
    let nearest = 0;
    let distance = Infinity;
    cards.forEach((card, index) => {
      const nextDistance = Math.abs(card.offsetLeft - currentLeft);
      if (nextDistance < distance) {
        distance = nextDistance;
        nearest = index;
      }
    });
    activeIndex = nearest;
    if (status) {
      status.textContent = `Chapter ${activeIndex + 1} of ${cards.length} · ${reducedMotion.matches ? "Use the arrows or swipe to explore" : userPaused ? "Automatic playback paused" : "Auto-advances every 6 seconds"}`;
    }
  };

  const goTo = (requestedIndex, automatic = false) => {
    if (!cards.length) return;
    const nextIndex = (requestedIndex + cards.length) % cards.length;
    activeIndex = nextIndex;
    const left = cards[nextIndex].offsetLeft - cards[0].offsetLeft;
    track.scrollTo({
      left,
      behavior: reducedMotion.matches ? "auto" : "smooth"
    });
    updateStatus();
  };

  const pauseForInteraction = () => {
    interacting = true;
    window.clearTimeout(interactionTimer);
    interactionTimer = window.setTimeout(() => {
      interacting = false;
      scheduleAutoplay();
    }, 8000);
    clearAutoplay();
  };

  controls.forEach(button => {
    button.addEventListener("click", () => {
      pauseForInteraction();
      const direction = Number(button.dataset.storyDirection) || 1;
      goTo(activeIndex + direction);
    });
  });

  autoplayToggle?.addEventListener("click", () => {
    userPaused = !userPaused;
    autoplayToggle.setAttribute("aria-pressed", String(userPaused));
    autoplayToggle.textContent = userPaused ? "Play" : "Pause";
    autoplayToggle.setAttribute(
      "aria-label",
      userPaused ? "Resume automatic story playback" : "Pause automatic story playback"
    );
    if (userPaused) clearAutoplay();
    else scheduleAutoplay();
    updateStatus();
  });

  track.addEventListener("scroll", updateStatus, { passive: true });
  track.addEventListener("pointerdown", pauseForInteraction, { passive: true });
  track.addEventListener("touchstart", pauseForInteraction, { passive: true });
  track.addEventListener("wheel", pauseForInteraction, { passive: true });
  track.addEventListener("keydown", pauseForInteraction);

  track.addEventListener("pointerenter", () => {
    hovered = true;
    clearAutoplay();
  });
  track.addEventListener("pointerleave", () => {
    hovered = false;
    scheduleAutoplay();
  });

  root.addEventListener("focusin", () => {
    focused = true;
    clearAutoplay();
  });
  root.addEventListener("focusout", event => {
    if (!root.contains(event.relatedTarget)) {
      focused = false;
      scheduleAutoplay();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearAutoplay();
    else scheduleAutoplay();
  });

  reducedMotion.addEventListener?.("change", () => {
    if (reducedMotion.matches) clearAutoplay();
    else scheduleAutoplay();
    updateStatus();
  });

  window.addEventListener("resize", () => {
    goTo(activeIndex, true);
    scheduleAutoplay();
  }, { passive: true });

  if (reducedMotion.matches && autoplayToggle) {
    autoplayToggle.hidden = true;
  }

  updateStatus();
  scheduleAutoplay();
}
