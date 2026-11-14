const track = document.getElementById("story-track");
const status = document.getElementById("story-status");
const root = track?.closest(".story-section");
const controls = root?.querySelectorAll("[data-story-direction]") ?? [];
const autoplayToggle = root?.querySelector("[data-story-autoplay-toggle]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const inPanelMode = () => document.documentElement.classList.contains("panels");

if (track && root) {
  const cards = [...track.querySelectorAll(".story-card")];
  const interval = 5000;
  let activeIndex = 0;
  let autoplayTimer = null;
  let interactionTimer = null;
  let interacting = false;
  let visible = false;
  let userPaused = reducedMotion.matches;
  let scrollFrame = null;

  cards.forEach((card, index) => {
    card.setAttribute("role", "group");
    card.setAttribute("aria-roledescription", "slide");
    card.setAttribute("aria-label", `Chapter ${index + 1} of ${cards.length}`);
  });

  const isBlocked = () => userPaused || interacting || document.hidden || !visible;

  const clearAutoplay = () => {
    if (autoplayTimer !== null) window.clearTimeout(autoplayTimer);
    autoplayTimer = null;
  };

  const syncToggle = () => {
    if (!autoplayToggle) return;
    autoplayToggle.textContent = userPaused ? "Play" : "Pause";
    autoplayToggle.setAttribute(
      "aria-label",
      userPaused ? "Resume automatic story playback" : "Pause automatic story playback"
    );
    autoplayToggle.dataset.state = userPaused ? "paused" : "playing";
  };

  const renderStatus = () => {
    if (!status || !cards.length) return;
    const message = userPaused
      ? reducedMotion.matches
        ? "Paused for reduced motion — press Play to start"
        : "Automatic playback paused"
      : interacting
        ? "Paused briefly after interaction"
        : "Auto-advances every 5 seconds";
    status.textContent = `Chapter ${activeIndex + 1} of ${cards.length} · ${message}`;
  };

  const slideLeft = (card) =>
    card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;

  const setPanelCard = (index) => {
    activeIndex = (index + cards.length) % cards.length;
    cards.forEach((card, i) => {
      const current = i === activeIndex;
      card.classList.toggle("is-current", current);
      card.inert = !current;
      if (current) {
        card.removeAttribute("aria-hidden");
        const image = card.querySelector(".story-image img");
        if (image && image.loading === "lazy") image.loading = "eager";
      } else {
        card.setAttribute("aria-hidden", "true");
      }
    });
    renderStatus();
  };

  const clearPanelCard = () => {
    cards.forEach((card) => {
      card.classList.remove("is-current");
      card.inert = false;
      card.removeAttribute("aria-hidden");
    });
  };

  const updateStatusFromScroll = () => {
    if (!cards.length || inPanelMode()) return;
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
    const next = (requestedIndex + cards.length) % cards.length;

    if (inPanelMode()) {
      setPanelCard(next);
      return;
    }

    activeIndex = next;
    track.scrollTo({
      left: slideLeft(cards[activeIndex]),
      behavior: reducedMotion.matches ? "auto" : "smooth",
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

  const pauseBrieflyForInteraction = () => {
    interacting = true;
    window.clearTimeout(interactionTimer);
    interactionTimer = window.setTimeout(() => {
      interacting = false;
      scheduleAutoplay();
      renderStatus();
    }, 1800);
    clearAutoplay();
    renderStatus();
  };

  controls.forEach((button) => {
    button.addEventListener("click", () => {
      pauseBrieflyForInteraction();
      const direction = Number(button.dataset.storyDirection) || 1;
      goTo(activeIndex + direction);
    });
  });

  autoplayToggle?.addEventListener("click", () => {
    userPaused = !userPaused;
    syncToggle();
    if (userPaused) {
      clearAutoplay();
    } else {
      interacting = false;
      window.clearTimeout(interactionTimer);
      scheduleAutoplay();
    }
    renderStatus();
  });

  track.addEventListener(
    "scroll",
    () => {
      if (inPanelMode()) return;
      if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = null;
        updateStatusFromScroll();
      });
    },
    { passive: true }
  );

  track.addEventListener("pointerdown", pauseBrieflyForInteraction, { passive: true });
  track.addEventListener("wheel", pauseBrieflyForInteraction, { passive: true });

  let swipeStart = null;

  track.addEventListener(
    "pointerdown",
    (event) => {
      if (inPanelMode()) swipeStart = event.clientX;
    },
    { passive: true }
  );

  track.addEventListener(
    "pointerup",
    (event) => {
      if (!inPanelMode() || swipeStart === null) return;
      const distance = event.clientX - swipeStart;
      swipeStart = null;
      if (Math.abs(distance) > 45) {
        goTo(activeIndex + (distance < 0 ? 1 : -1));
      }
    },
    { passive: true }
  );

  track.addEventListener("pointercancel", () => {
    swipeStart = null;
  });

  track.addEventListener("keydown", (event) => {
    if (
      inPanelMode() &&
      (event.key === "ArrowLeft" || event.key === "ArrowRight")
    ) {
      event.preventDefault();
      pauseBrieflyForInteraction();
      goTo(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
    } else if (["ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"].includes(event.key)) {
      pauseBrieflyForInteraction();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearAutoplay();
    else scheduleAutoplay();
  });

  window.addEventListener(
    "resize",
    () => {
      if (!cards.length) return;
      if (inPanelMode()) {
        setPanelCard(activeIndex);
        return;
      }
      track.scrollTo({ left: slideLeft(cards[activeIndex]), behavior: "auto" });
      updateStatusFromScroll();
    },
    { passive: true }
  );

  window.addEventListener("panelmodechange", (event) => {
    if (event.detail.enabled) {
      setPanelCard(activeIndex);
    } else {
      clearPanelCard();
      track.scrollTo({ left: slideLeft(cards[activeIndex]), behavior: "auto" });
      updateStatusFromScroll();
    }
    renderStatus();
  });

  /* Only run the slideshow while the story is actually on screen. */
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) {
          scheduleAutoplay();
          renderStatus();
        } else {
          clearAutoplay();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(root);
  } else {
    visible = true;
    scheduleAutoplay();
  }

  if (inPanelMode()) {
    setPanelCard(0);
  } else {
    clearPanelCard();
    updateStatusFromScroll();
  }

  syncToggle();
}
