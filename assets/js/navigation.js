const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".primary-nav");

if (menu && nav) {
  const mobileQuery = window.matchMedia("(max-width: 900px)");

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
    ) setMenuOpen(false);
  });

  mobileQuery.addEventListener("change", (event) => {
    if (!event.matches) setMenuOpen(false);
  });
}

/* The page is a horizontal strip of independently vertically-scrollable panels.
   Calculate positions from live rectangles rather than offsetLeft, whose
   offset-parent can vary with layout and browser. */
const panelTrack = document.getElementById("main");

if (panelTrack) {
  const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  const panels = [...panelTrack.children].filter((node) =>
    node.matches("section, .site-footer")
  );

  const panelFor = (target) => target?.closest("section, .site-footer");
  const panelLeft = (panel) =>
    panelTrack.scrollLeft +
    panel.getBoundingClientRect().left -
    panelTrack.getBoundingClientRect().left;

  const scrollToPanel = (panel, behavior = "smooth") => {
    if (!panel || !panels.includes(panel)) return;
    panelTrack.scrollTo({ left: panelLeft(panel), behavior });
  };

  const scrollToTarget = (target, behavior = "smooth") => {
    const panel = panelFor(target);
    if (!panel) return;
    scrollToPanel(panel, behavior);
    if (target !== panel) {
      requestAnimationFrame(() => {
        const top = target.getBoundingClientRect().top -
          panel.getBoundingClientRect().top + panel.scrollTop;
        panel.scrollTo({ top, behavior });
      });
    } else {
      panel.scrollTo({ top: 0, behavior });
    }
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.('a[href^="#"]');
    if (!link) return;
    const rawHash = link.getAttribute("href");
    if (!rawHash || rawHash === "#" || rawHash === "#main") return;

    let target;
    try {
      target = document.getElementById(decodeURIComponent(rawHash.slice(1)));
    } catch {
      return;
    }
    if (!target || !panelFor(target)) return;

    event.preventDefault();
    scrollToTarget(target);
    if (window.location.hash !== rawHash) {
      history.replaceState(null, "", rawHash);
    }
  });

  const closestPanel = () => {
    if (!panels.length) return null;
    const left = panelTrack.getBoundingClientRect().left;
    return panels.reduce((best, panel) =>
      Math.abs(panel.getBoundingClientRect().left - left) <
      Math.abs(best.getBoundingClientRect().left - left) ? panel : best
    , panels[0]);
  };

  let scrollFrame = null;
  panelTrack.addEventListener("scroll", () => {
    if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = null;
      const current = closestPanel();
      if (!current?.id) return;
      navLinks.forEach((link) => link.removeAttribute("aria-current"));
      navLinks.find((link) => link.getAttribute("href") === "#" + current.id)
        ?.setAttribute("aria-current", "location");
    });
  }, { passive: true });

  const restoreHashPosition = () => {
    if (!window.location.hash || window.location.hash === "#main") return;
    let target;
    try {
      target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    } catch {
      return;
    }
    if (target && panelFor(target)) scrollToTarget(target, "auto");
  };

  window.addEventListener("load", restoreHashPosition, { once: true });
  window.addEventListener("resize", () => {
    const current = closestPanel();
    if (current) scrollToPanel(current, "auto");
  }, { passive: true });
}
