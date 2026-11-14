const dialog = document.getElementById("lightbox");
const image = document.getElementById("lightbox-image");
const frame = document.getElementById("lightbox-video");
const title = document.getElementById("lightbox-title");
const closeButton = dialog?.querySelector("[data-lightbox-close]");
const previousButton = dialog?.querySelector("[data-lightbox-prev]");
const nextButton = dialog?.querySelector("[data-lightbox-next]");

const links = [...document.querySelectorAll("a[data-lightbox]")];
const items = links.map((link) => ({
  link,
  src: link.getAttribute("href"),
  title: link.dataset.lightbox || link.querySelector("img")?.alt || "Golden Gate photograph",
  video: link.dataset.video || "",
}));

let activeIndex = 0;

function clearFrame() {
  if (frame) {
    frame.src = "about:blank";
    frame.hidden = true;
  }
}

function render() {
  const item = items[activeIndex];
  if (!item) return;

  if (title) title.textContent = item.title;

  if (item.video) {
    if (image) image.hidden = true;
    if (frame) {
      frame.hidden = false;
      frame.src = item.video;
      frame.title = item.title;
    }
  } else {
    clearFrame();
    if (image) {
      image.hidden = false;
      image.src = item.src;
      image.alt = item.title;
    }
  }

  const multiple = items.length > 1;
  if (previousButton) previousButton.hidden = !multiple;
  if (nextButton) nextButton.hidden = !multiple;
}

function open(index) {
  if (!dialog || !items.length) return;
  activeIndex = (index + items.length) % items.length;
  render();
  if (typeof dialog.showModal === "function") dialog.showModal();
}

function close() {
  dialog?.close();
}

links.forEach((link, index) => {
  link.addEventListener("click", (event) => {
    if (!dialog || typeof dialog.showModal !== "function") return;
    event.preventDefault();
    open(index);
  });
});

closeButton?.addEventListener("click", close);
previousButton?.addEventListener("click", () => open(activeIndex - 1));
nextButton?.addEventListener("click", () => open(activeIndex + 1));

dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) close();
});

dialog?.addEventListener("close", clearFrame);

dialog?.addEventListener("keydown", (event) => {
  if (!items.length) return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    open(activeIndex - 1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    open(activeIndex + 1);
  }
});
