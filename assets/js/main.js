import "./navigation.js?v=20261114c";
import "./donations.js?v=20261114c";
import "./story-carousel.js?v=20261114c";
import "./lightbox.js?v=20261114c";

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});
