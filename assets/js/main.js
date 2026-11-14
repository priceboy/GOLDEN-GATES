import "./navigation.js?v=20261114j";
import "./donations.js?v=20261114j";
import "./story-carousel.js?v=20261114j";
import "./lightbox.js?v=20261114j";

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});
