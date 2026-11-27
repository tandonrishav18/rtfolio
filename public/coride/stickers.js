// Animation removed — stickers stay visible
const stickerSection = document.querySelector(".sticker-section");
if (stickerSection) {
  const stickers = Array.from(stickerSection.children).filter(layer => layer.querySelector("img"));
  stickers.forEach(layer => layer.classList.add("sticker"));
  // Skip stickers-ready (which hides them) and stickers-playing (which pops them in).
  // Stickers are visible at their natural position from the start.
}
