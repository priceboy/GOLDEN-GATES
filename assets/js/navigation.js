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