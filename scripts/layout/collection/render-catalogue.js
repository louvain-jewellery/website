import { breadcrumbNav } from "./breadcrumb-nav.js";
import { renderVideos } from "./render-videos.js";
import {
  addToFavorite,
  loadFavorites,
  updateFavoriteIcon,
} from "../../utils/favorites.js";

export function renderCatalogue(collection) {
  const showItemCount = document.querySelector(".js-item-count");
  const catalogueWrapper = document.querySelector(".js-catalogue-wrapper");
  catalogueWrapper.innerHTML = "";

  breadcrumbNav(collection);

  const dataSrc =
    collection === "best-sellers"
      ? "data/best-sellers.json"
      : "data/catalogue.json";

  fetch(dataSrc)
    .then((response) => response.json())
    .then((items) => {
      if (collection === "best-sellers")
        return renderVideos(items, catalogueWrapper, showItemCount);

      const filteredCollection = collection
        ? items.filter((item) => item.collection === collection)
        : items;

      filteredCollection.forEach((item) => {
        const html = `
          <div class="catalogue-item">
            <a class="catalogue-item__image-link" href="${item.detailLink}">
              <img
                class="catalogue-item__image"
                src="${item.images[0]}"
                alt="${item.name}"
              />
            </a>
            <div class="catalogue-item__overlay">
              <a
                class="catalogue-item__image-link-overlay"
                href="item.html?id=${item.id}"
              >
                <img
                  class="catalogue-item__image-overlay"
                  src="${item.images[0]}"
                  alt="${item.name}"
                />
              </a>
              <button class="favorite-button js-favorite-button" data-item-id="${item.id}">
                <img class="js-favorite-icon" src="icons/favorite_22dp_000000_FILL0_wght200_GRAD0_opsz24.svg" />
              </button>
              <h2 class="catalogue-item__name">${item.name}</h2>
              <a class="catalogue-item__button" href="item.html?id=${item.id}"
                >Lihat Produk</a
              >
            </div>
          </div>
        `;
        catalogueWrapper.insertAdjacentHTML("beforeend", html);
        showItemCount.textContent = `${filteredCollection.length} Items`;
      });
      loadFavorites();
      updateFavoriteIcon();
      addToFavorite();
    });
}
