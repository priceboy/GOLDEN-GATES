import "./navigation.js";
import "./donations.js";
import "./story-carousel.js";

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});
