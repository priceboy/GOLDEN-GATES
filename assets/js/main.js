import "./navigation.js?v=20261114n";
import "./donations.js?v=20261114n";
import "./story-carousel.js?v=20261114n";
import "./lightbox.js?v=20261114n";
import "./team.js?v=20261114n";

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});
