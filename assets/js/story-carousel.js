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
  let scrollFrame = null;

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

  const renderStatus = () => {
    if (!status || !cards.length) return;
    const message = reducedMotion.matches
      ? "Use the arrows or swipe to explore"
      : userPaused
        ? "Automatic playback paused"
        : hovered || focused || interacting
          ? "Paused while you interact"
          : "Auto-advances every 6 seconds";
    status.textContent = `Chapter ${activeIndex + 1} of ${cards.length} · ${message}`;
  };

  // Measure each slide against the track itself; do not assume a fixed
  // slide width or rely on offsetLeft's offset-parent behaviour.
  const slideLeft = (card) =>
    card.getBoundingClientRect().left -
    track.getBoundingClientRect().left +
    track.scrollLeft;

  const updateStatus = () => {
    if (!cards.length) return;
    const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - trackCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    activeIndex = closestIndex;
    renderStatus();
  };

  const goTo = (requestedIndex) => {
    if (!cards.length) return;
    activeIndex = (requestedIndex + cards.length) % cards.length;
    track.scrollTo({
      left: slideLeft(cards[activeIndex]),
      behavior: reducedMotion.matches ? "auto" : "smooth"
    });
    renderStatus();
  };

  const scheduleAutoplay = () => {
    clearAutoplay();
    if (!cards.length || isBlocked()) return;
    autoplayTimer = window.setTimeout(() => {
      goTo(activeIndex + 1);
      scheduleAutoplay();
    }, interval);
  };

  const pauseForInteraction = () => {
    interacting = true;
    window.clearTimeout(interactionTimer);
    interactionTimer = window.setTimeout(() => {
      interacting = false;
      scheduleAutoplay();
      renderStatus();
    }, 8000);
    clearAutoplay();
    renderStatus();
  };

  controls.forEach((button) => {
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
    renderStatus();
  });

  track.addEventListener("scroll", () => {
    if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = null;
      updateStatus();
    });
  }, { passive: true });

  track.addEventListener("pointerdown", pauseForInteraction, { passive: true });
  track.addEventListener("wheel", pauseForInteraction, { passive: true });
  track.addEventListener("keydown", pauseForInteraction);

  track.addEventListener("pointerenter", () => {
    hovered = true;
    clearAutoplay();
    renderStatus();
  });
  track.addEventListener("pointerleave", () => {
    hovered = false;
    scheduleAutoplay();
    renderStatus();
  });

  root.addEventListener("focusin", () => {
    focused = true;
    clearAutoplay();
    renderStatus();
  });
  root.addEventListener("focusout", (event) => {
    if (!root.contains(event.relatedTarget)) {
      focused = false;
      scheduleAutoplay();
      renderStatus();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearAutoplay();
    else scheduleAutoplay();
  });

  reducedMotion.addEventListener?.("change", () => {
    if (reducedMotion.matches) clearAutoplay();
    else scheduleAutoplay();
    renderStatus();
  });

  window.addEventListener("resize", () => {
    if (!cards.length) return;
    track.scrollTo({ left: slideLeft(cards[activeIndex]), behavior: "auto" });
    updateStatus();
  }, { passive: true });

  if (reducedMotion.matches && autoplayToggle) {
    autoplayToggle.hidden = true;
  }

  updateStatus();
  scheduleAutoplay();
}
