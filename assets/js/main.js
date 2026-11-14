import "./navigation.js?v=20261114";
import "./donations.js?v=20261114";
import "./story-carousel.js?v=20261114";
import "./lightbox.js?v=20261114";

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});
