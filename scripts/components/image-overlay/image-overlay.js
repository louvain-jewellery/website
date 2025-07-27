import { scrollOverlay } from "../overlayScroll.js";

export function showImageOverlay(item, selectedImage, allImages) {
  const imageOverlay = document.querySelector(".js-image-overlay");
  const imageSlider = document.createElement("div");
  imageSlider.classList.add("image-overlay__image-slider", "js-image-slider");
  imageOverlay.innerHTML = "";
  let imageWrapper = "";

  const sourceImages = [
    selectedImage,
    ...allImages.filter((image) => image !== selectedImage),
  ];

  sourceImages.forEach((image) => {
    const img = document.createElement("img");
    img.src = image;
    img.alt = item.name;
    img.classList.add("image-overlay__image");

    imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-overlay__image-wrapper");
    imageWrapper.appendChild(img);
    imageSlider.appendChild(imageWrapper);
  }); 

  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.classList.add(
    "image-overlay__buttons-wrapper",
    "js-buttons-wrapper"
  );
  buttonsWrapper.innerHTML = `
    <button
      class="image-overlay__left-button image-overlay__button js-left-button">
      &lt;
    </button>
    <button
      class="image-overlay__close-button image-overlay__button js-close-button">
      &#10005;
    </button>
    <button
      class="image-overlay__right-button image-overlay__button js-right-button">
      &gt;
    </button>
  `;

  imageOverlay.appendChild(imageSlider);
  imageOverlay.appendChild(buttonsWrapper);
  imageOverlay.classList.add("visible");
  document.body.style.overflow = "hidden";

  scrollOverlay();
}
