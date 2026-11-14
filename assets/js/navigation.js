const panelQuery = window.matchMedia("(min-width: 1025px)");
const root = document.documentElement;
const track = document.getElementById("main");
const sections = track ? [...track.querySelectorAll(":scope > section")] : [];
const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
const progress = document.getElementById("panel-progress");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let panelMode = false;
let currentIndex = 0;
let wheelLocked = false;
let scrollFrame = null;
let lastWidth = window.innerWidth;

/* ---------- Mobile menu ---------- */
const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".primary-nav");

if (menu && nav) {
  const mobileQuery = window.matchMedia("(max-width: 1040px)");

  const setMenuOpen = (open, { restoreFocus = false } = {}) => {
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav.classList.toggle("is-open", open);
    if (!open && restoreFocus) menu.focus();
    if (open && mobileQuery.matches) {
      nav.querySelector("a")?.focus({ preventScroll: true });
    }
  };

  menu.addEventListener("click", () => {
    setMenuOpen(menu.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false, { restoreFocus: true });
    }
  });

  document.addEventListener("click", (event) => {
    if (
      menu.getAttribute("aria-expanded") === "true" &&
      !nav.contains(event.target) &&
      !menu.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  });

  mobileQuery.addEventListener("change", (event) => {
    if (!event.matches) setMenuOpen(false);
  });
}

/* ---------- Current navigation item ---------- */
const setCurrent = (id) => {
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === `#${id}`) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

/* ---------- Vertical mode spy ---------- */
let verticalObserver = null;

const updateVerticalCurrent = () => {
  if (panelMode || !sections.length) return;
  const fromTop = window.scrollY + 140;
  const current = [...sections].reverse().find((section) => section.offsetTop <= fromTop) || sections[0];
  if (current) setCurrent(current.id);
};

if ("IntersectionObserver" in window) {
  verticalObserver = new IntersectionObserver(
    (entries) => {
      if (panelMode) return;
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setCurrent(visible.target.id);
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
  );
  sections.forEach((section) => verticalObserver.observe(section));
} else {
  let frame = null;
  window.addEventListener(
    "scroll",
    () => {
      if (panelMode) return;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = null;
        updateVerticalCurrent();
      });
    },
    { passive: true }
  );
}

/* ---------- Horizontal panels ---------- */
const panelOffset = (panel) =>
  panel.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;

const setTrackScroll = (left, behavior) => {
  if (behavior === "auto") {
    const previous = track.style.scrollBehavior;
    track.style.scrollBehavior = "auto";
    track.scrollTo({ left, behavior: "auto" });
    track.style.scrollBehavior = previous;
  } else {
    track.scrollTo({ left, behavior });
  }
};

const setActivePanel = (index) => {
  if (!panelMode || !sections.length) return;
  const clamped = Math.max(0, Math.min(sections.length - 1, index));
  currentIndex = clamped;

  sections.forEach((section, i) => {
    const active = i === clamped;
    section.classList.toggle("is-active", active);

    if (active) {
      section.inert = false;
      section.removeAttribute("aria-hidden");
    } else {
      section.inert = true;
      section.setAttribute("aria-hidden", "true");
    }
  });

  const id = sections[clamped]?.id;
  if (id) setCurrent(id);

  if (progress) {
    progress.style.width = `${((clamped + 1) / sections.length) * 100}%`;
  }
};

const goToPanel = (index, behavior = "smooth") => {
  if (!panelMode || !sections.length) return;
  const clamped = Math.max(0, Math.min(sections.length - 1, index));
  currentIndex = clamped;
  setTrackScroll(panelOffset(sections[clamped]), reducedMotion.matches ? "auto" : behavior);
  setActivePanel(clamped);
};

const applyMode = () => {
  if (!sections.length) return;

  panelMode = panelQuery.matches;
  root.classList.toggle("panels", panelMode);

  if (panelMode) {
    const hashId = location.hash.replace("#", "");
    const hashIndex = sections.findIndex((section) => section.id === hashId);
    const index = hashIndex >= 0 ? hashIndex : 0;

    setTrackScroll(panelOffset(sections[index]), "auto");
    setActivePanel(index);
  } else {
    sections.forEach((section) => {
      section.inert = false;
      section.removeAttribute("aria-hidden");
      section.classList.remove("is-active");
    });
    track.scrollTo({ left: 0, behavior: "auto" });
    updateVerticalCurrent();
  }

  window.dispatchEvent(new CustomEvent("panelmodechange", { detail: { enabled: panelMode } }));
};

if (track) {
  track.addEventListener(
    "scroll",
    () => {
      if (!panelMode) return;
      if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = null;
        const width = track.clientWidth || 1;
        const index = Math.round(track.scrollLeft / width);
        if (index !== currentIndex && sections[index]) {
          currentIndex = index;
          setActivePanel(index);
        }
      });
    },
    { passive: true }
  );

  track.addEventListener(
    "wheel",
    (event) => {
      if (!panelMode || event.ctrlKey) return;
      if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      if (Math.abs(event.deltaY) < 6) return;

      const panel = event.target.closest?.("section");
      if (panel) {
        const canScroll = panel.scrollHeight > panel.clientHeight + 1;
        if (canScroll) {
          const atTop = panel.scrollTop <= 0;
          const atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;
          if ((event.deltaY < 0 && !atTop) || (event.deltaY > 0 && !atBottom)) return;
        }
      }

      event.preventDefault();
      if (wheelLocked) return;
      wheelLocked = true;
      window.setTimeout(() => {
        wheelLocked = false;
      }, 480);
      goToPanel(currentIndex + (event.deltaY > 0 ? 1 : -1));
    },
    { passive: false }
  );
}

document.addEventListener("keydown", (event) => {
  if (!panelMode || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

  const active = document.activeElement;
  const activeSection = active?.closest?.("#main > section");
  if (activeSection && active !== activeSection) return;
  if (active?.closest?.("input, select, textarea, [contenteditable='true'], .story-track")) return;
  if (document.querySelector("dialog[open]")) return;

  event.preventDefault();
  goToPanel(currentIndex + (event.key === "ArrowRight" ? 1 : -1));
});

/* ---------- In-page links ---------- */
document.addEventListener("click", (event) => {
  const link = event.target.closest?.('a[href^="#"]');
  if (!link) return;

  const hash = link.getAttribute("href");
  if (!hash || hash === "#" || hash === "#main") return;

  let target;
  try {
    target = document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return;
  }
  if (!target) return;

  const panel = target.closest("section");

  if (panelMode && panel && sections.includes(panel)) {
    event.preventDefault();
    /* Jump instantly, then fade the target panel in. Smooth horizontal travel
       across several panels fights the fade and can drop focus mid-scroll. */
    goToPanel(sections.indexOf(panel), "auto");

    if (location.hash !== hash) {
      history.pushState(null, "", hash);
    }

    if (target !== panel) {
      requestAnimationFrame(() => {
        const top =
          target.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop;
        panel.scrollTo({ top, behavior: reducedMotion.matches ? "auto" : "smooth" });
      });
    }
  }

  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
});

window.addEventListener("popstate", () => {
  if (!panelMode) return;
  const id = location.hash.slice(1);
  const index = sections.findIndex((section) => section.id === id);
  goToPanel(index >= 0 ? index : 0, "auto");
});

window.addEventListener(
  "resize",
  () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    if (panelMode && sections[currentIndex]) {
      setTrackScroll(panelOffset(sections[currentIndex]), "auto");
    }
  },
  { passive: true }
);

panelQuery.addEventListener("change", applyMode);

/* ---------- Floating support CTA ---------- */
const floatingSupport = document.querySelector(".floating-support");
const donateSection = document.getElementById("donate");

if (floatingSupport && donateSection && "IntersectionObserver" in window) {
  const setFloatingHidden = (hidden) => {
    floatingSupport.classList.toggle("is-hidden", hidden);
    floatingSupport.tabIndex = hidden ? -1 : 0;
    if (hidden) {
      floatingSupport.setAttribute("aria-hidden", "true");
    } else {
      floatingSupport.removeAttribute("aria-hidden");
    }
  };

  const supportObserver = new IntersectionObserver(
    ([entry]) => setFloatingHidden(entry.isIntersecting),
    { threshold: 0.2 }
  );

  supportObserver.observe(donateSection);
}

applyMode();
