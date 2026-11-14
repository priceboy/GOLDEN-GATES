import "./navigation.js?v=20261114l";
import "./donations.js?v=20261114l";
import "./story-carousel.js?v=20261114l";
import "./lightbox.js?v=20261114l";

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});
