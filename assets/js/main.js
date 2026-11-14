import "./navigation.js?v=20261114b";
import "./donations.js?v=20261114b";
import "./story-carousel.js?v=20261114b";
import "./lightbox.js?v=20261114b";

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});
