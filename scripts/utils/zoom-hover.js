export function zoomHover() {
  const image = document.querySelector(".image-overlay__image");
  const imageWrapper = document.querySelector(".image-overlay__image-wrapper");

  let isDragging = false;

  imageWrapper.addEventListener("mousedown", () => {
    isDragging = true;
    image.style.transform = "scale(2)";
  });

  imageWrapper.addEventListener("mouseup", () => {
    isDragging = false;
    image.style.transform = "scale(1)";
  });

  imageWrapper.addEventListener("mouseleave", () => {
    isDragging = false;
    image.style.transform = "scale(1)";
  });

  imageWrapper.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const bounds = imageWrapper.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;

    image.style.transformOrigin = `${x}% ${y}%`;
  });
}
