export function zoomHover() {
  const wrappers = document.querySelectorAll(".image-overlay__image-wrapper");

  wrappers.forEach((wrapper) => {
    const image = wrapper.querySelector(".image-overlay__image");
    let isDragging = false;

    wrapper.addEventListener("mousedown", () => {
      isDragging = true;
      image.style.transform = "scale(2)";
    });

    wrapper.addEventListener("mouseup", () => {
      isDragging = false;
      image.style.transform = "scale(1)";
    });

    wrapper.addEventListener("mouseleave", () => {
      isDragging = false;
      image.style.transform = "scale(1)";
    });

    wrapper.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const bounds = wrapper.getBoundingClientRect();
      const x = ((e.clientX - bounds.left) / bounds.width) * 100;
      const y = ((e.clientY - bounds.top) / bounds.height) * 100;

      image.style.transformOrigin = `${x}% ${y}%`;
    });
  });
}
