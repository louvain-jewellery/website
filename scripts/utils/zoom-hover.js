export function zoomHover() {
  const mainImage = document.querySelector(".js-main-image");
  const imageWrapper = document.querySelector(".js-main-image-wrapper");

  imageWrapper.addEventListener("mousemove", (e) => {
    const bounds = imageWrapper.getBoundingClientRect();

    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;

    mainImage.style.transformOrigin = `${x}% ${y}%`;
    mainImage.style.transform = `scale(2)`;
  });

  imageWrapper.addEventListener("mouseleave", () => {
    mainImage.style.transform = "scale(1)";
  });
}
