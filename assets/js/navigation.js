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
    ) {
      setMenuOpen(false);
    }
  });

  mobileQuery.addEventListener("change", (event) => {
    if (!event.matches) setMenuOpen(false);
  });
}

/* Keep the current section marked in the navigation. */
const sections = [...document.querySelectorAll("main > section[id]")];
const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];

const markCurrent = (id) => {
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === `#${id}`) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

if (sections.length) {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) markCurrent(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((section) => observer.observe(section));
  } else {
    let frame = null;
    window.addEventListener(
      "scroll",
      () => {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          frame = null;
          const fromTop = window.scrollY + 140;
          const current = sections.filter((section) => section.offsetTop <= fromTop).pop();
          if (current) markCurrent(current.id);
        });
      },
      { passive: true }
    );
  }
}

/* Move keyboard/screen-reader focus to the section a visitor chose. */
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

  target.setAttribute("tabindex", "-1");
  requestAnimationFrame(() => target.focus({ preventScroll: true }));
});

/* Hide the floating support CTA while the support section is on screen. */
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
