export function hideOverlay(e, overlay, itemWrapper) {
  const closeButton = overlay.querySelector(".js-close-button");
  const buttonsWrapper = document.querySelector(".js-buttons-wrapper");

  if (
    e.target === closeButton ||
    (!itemWrapper.contains(e.target) && !buttonsWrapper.contains(e.target))
  ) {
    overlay.classList.remove("visible");
    overlay.innerHTML = "";
    document.body.style.overflow = "";
  }
}
