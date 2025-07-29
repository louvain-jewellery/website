export function scrollOverlay() {
  const leftButton = document.querySelector(".js-left-button");
  const rightButton = document.querySelector(".js-right-button");
  const imageSlider = document.querySelector(".js-image-slider");

  leftButton.addEventListener("click", () => {
    const scrollLeft = imageSlider.scrollLeft;
    if (scrollLeft === 0) {
      imageSlider.scrollTo({
        left: imageSlider.scrollWidth,
        behavior: "auto",
      });
      return;
    }
    imageSlider.scrollBy({
      left: -200,
      behavior: "auto",
    });
  });

  rightButton.addEventListener("click", () => {
    const scrollLeft = imageSlider.scrollLeft;
    const maxScroll = imageSlider.scrollWidth - imageSlider.clientWidth;
    if (Math.ceil(scrollLeft) >= maxScroll) {
      imageSlider.scrollTo({
        left: 0,
        behavior: "auto",
      });
      return;
    }
    imageSlider.scrollBy({
      left: 200,
      behavior: "auto",
    });
  });
}
