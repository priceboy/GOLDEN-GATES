import "./navigation.js?v=20261114s";
import "./donations.js?v=20261114s";
import "./story-carousel.js?v=20261114s";
import "./lightbox.js?v=20261114s";
import "./team.js?v=20261114s";

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});
