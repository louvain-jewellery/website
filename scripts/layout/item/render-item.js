import { hideOverlay } from "../../components/hide-overlay.js";
import { showImageOverlay } from "../../components/image-overlay/image-overlay.js";
import { renderDiscover } from "./render-discover.js";
import { setupFavorites } from "../../utils/favorites.js";

export function renderItem(id) {
  const thumbnailWrapper = document.querySelector(".js-thumbnails-wrapper");
  const mainImage = document.querySelector(".js-main-image");
  const imageOverlay = document.querySelector(".js-image-overlay");

  const itemName = document.querySelector(".js-item-name");
  const itemDesign = document.querySelector(".js-item-design");
  const wRingWidth = document.querySelector(".js-w-ring-width");
  const wGemSpecs = document.querySelector(".js-w-gem-specs");
  const mRingWidth = document.querySelector(".js-m-ring-width");
  const mGemSpecs = document.querySelector(".js-m-gem-specs");
  let thumbnailCount = 1;

  imageOverlay.addEventListener("click", (e) => {
    const imageSlider = imageOverlay.querySelector(
      ".image-overlay__image-slider"
    );
    hideOverlay(e, imageOverlay, imageSlider);
  });

  fetch("data/catalogue.json")
    .then((response) => response.json())
    .then((data) => {
      const item = data.find((items) => id === items.id);

      mainImage.src = item.images[0];
      mainImage.dataset.imageSource = item.images[0];
      item.images.forEach((image) => {
        const img = document.createElement("img");
        img.src = image;
        img.alt = `Thumbnail ${thumbnailCount++}`;
        img.classList.add("item-images__thumbnail-image", "js-thumbnail-image");

        img.addEventListener("click", () => {
          mainImage.src = image;
          mainImage.dataset.imageSource = image;
        });

        thumbnailWrapper.appendChild(img);
      });
      document.querySelector(".js-favorite-button").dataset.itemId = item.id;

      itemName.textContent = item.name;
      itemDesign.textContent =
        item.collection.charAt(0).toUpperCase() +
        item.collection.slice(1) +
        " Design";
      wRingWidth.textContent = item.specs.ringWidth.wanita;
      mRingWidth.textContent = item.specs.ringWidth.pria;
      wGemSpecs.textContent = item.specs.gem.wanita;
      mGemSpecs.textContent = item.specs.gem.pria;

      mainImage.addEventListener("click", () => {
        const selectedImage = mainImage.dataset.imageSource;
        showImageOverlay(item, selectedImage, item.images);
      });

      const sameCollection =
        item.collection === "stacking"
          ? data.filter((i) => i.collection === item.collection)
          : data.filter(
              (i) => i.collection === item.collection && i.id !== item.id
            );
      renderDiscover(sameCollection);

      setupFavorites();
    });
}
