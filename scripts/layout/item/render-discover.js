import {
  addToFavorite,
  loadFavorites,
  updateFavoriteIcon,
} from "../../utils/favorites.js";

export function renderDiscover(sameCollection) {
  const discoverWrapper = document.querySelector(".js-items-wrapper");
  sameCollection.slice(0, 4).forEach((item) => {
    const html = `
      <div class="catalogue-item">
        <a class="catalogue-item__image-link" href="item.html?id=${item.id}">
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
          <button class="favorite-button js-favorite-button" data-item-id:${item.id}>
            <img class="js-favorite-icon" src="icons/favorite_22dp_000000_FILL0_wght200_GRAD0_opsz24.svg" />
          </button>
          <h2 class="catalogue-item__name">${item.name}</h2>
          <a class="catalogue-item__button" href="item.html?id=${item.id}"
            >Lihat Produk</a
          >
        </div>
      </div>
    `;
    discoverWrapper.insertAdjacentHTML("beforeend", html);
  });
  loadFavorites();
  updateFavoriteIcon();
  addToFavorite();
}
