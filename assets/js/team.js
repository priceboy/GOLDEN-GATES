document.querySelectorAll("[data-team-toggle]").forEach((button) => {
  const card = button.closest(".team-card");
  const bio = document.getElementById(button.getAttribute("aria-controls") || "");
  if (!card || !bio) return;

  button.addEventListener("click", () => {
    const expanded = card.classList.toggle("is-expanded");
    button.setAttribute("aria-expanded", String(expanded));
    button.textContent = expanded ? "Read less" : "Read more";
  });
});
