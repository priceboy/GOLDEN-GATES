import "./navigation.js?v=20261114p";
import "./donations.js?v=20261114p";
import "./story-carousel.js?v=20261114p";
import "./lightbox.js?v=20261114p";
import "./team.js?v=20261114p";

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});
