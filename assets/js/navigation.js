const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".primary-nav");

if (menu && nav) {
  const mobileQuery = window.matchMedia("(max-width: 900px)");
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setMenuOpen = (open, { restoreFocus = false } = {}) => {
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav.classList.toggle("is-open", open);

    if (!open && restoreFocus) menu.focus();
    if (open && mobileQuery.matches) {
      const firstLink = nav.querySelector("a");
      if (firstLink) firstLink.focus({ preventScroll: true });
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

  if ("IntersectionObserver" in window) {
    const linkBySection = new Map(
      links.map((link) => [link.getAttribute("href").slice(1), link])
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        links.forEach((link) => link.removeAttribute("aria-current"));
        const activeLink = linkBySection.get(visible.target.id);
        if (activeLink) activeLink.setAttribute("aria-current", "location");
      },
      {
        rootMargin: "-22% 0px -58% 0px",
        threshold: [0, 0.15, 0.35, 0.6]
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
}

/* Navigate between top-level panels horizontally while preserving
   normal vertical scrolling inside each panel. */
const panelTrack = document.getElementById("main");
if (panelTrack) {
  const panelNavLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  const panels = [...panelTrack.children].filter((node) =>
    node.matches("section, .site-footer")
  );
  const panelFor = (target) => target?.closest("section, .site-footer");
  const scrollToPanel = (panel, behavior = "smooth") => {
    if (!panel || !panels.includes(panel)) return;
    panelTrack.scrollTo({ left: panel.offsetLeft, behavior });
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = decodeURIComponent(link.getAttribute("href").slice(1));
    if (!id || id === "main") return;
    const target = document.getElementById(id);
    const panel = panelFor(target);
    if (!panel) return;
    event.preventDefault();
    if (target === panel) {
      scrollToPanel(panel);
    } else {
      scrollToPanel(panel);
      requestAnimationFrame(() => {
        const top = target.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop;
        panel.scrollTo({ top, behavior: "smooth" });
      });
    }
    if (window.location.hash !== link.getAttribute("href")) {
      history.replaceState(null, "", link.getAttribute("href"));
    }
  });

  let panelScrollFrame = null;
  panelTrack.addEventListener("scroll", () => {
    if (panelScrollFrame !== null) cancelAnimationFrame(panelScrollFrame);
    panelScrollFrame = requestAnimationFrame(() => {
      panelScrollFrame = null;
      const current = panels.reduce((best, panel) =>
        Math.abs(panel.offsetLeft - panelTrack.scrollLeft) <
        Math.abs(best.offsetLeft - panelTrack.scrollLeft) ? panel : best
      , panels[0]);
      if (!current?.id) return;
      panelNavLinks.forEach((link) => link.removeAttribute("aria-current"));
      const active = panelNavLinks.find((link) => link.getAttribute("href") === "#" + current.id);
      active?.setAttribute("aria-current", "location");
    }, { passive: true });
  }, { passive: true });

  window.addEventListener("load", () => {
    const initial = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    const panel = panelFor(initial);
    if (panel) scrollToPanel(panel, "auto");
  }, { once: true });

  window.addEventListener("resize", () => {
    const current = panels.reduce((best, panel) =>
      Math.abs(panel.offsetLeft - panelTrack.scrollLeft) <
      Math.abs(best.offsetLeft - panelTrack.scrollLeft) ? panel : best
    , panels[0]);
    scrollToPanel(current, "auto");
  }, { passive: true });
}
