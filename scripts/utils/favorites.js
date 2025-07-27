import { renderFavorite } from "../layout/favorite/render-favorite.js";

export let favoriteItem;

export function saveToStorage() {
  localStorage.setItem("favorite", JSON.stringify(favoriteItem));
}

export function loadFavorites() {
  favoriteItem = JSON.parse(localStorage.getItem("favorite")) || [];
}

export function updateFavoriteIcon() {
  const favoriteButton = document.querySelectorAll(".js-favorite-button");
  favoriteButton.forEach((button) => {
    const { itemId } = button.dataset;
    const isFavorited = favoriteItem.includes(itemId);
    if (isFavorited) {
      button.querySelector(".js-favorite-icon").src =
        "icons/favorite_22dp_1F1F1F_FILL1_wght300_GRAD0_opsz24.svg";
    } else {
      button.querySelector(".js-favorite-icon").src =
        "icons/favorite_22dp_000000_FILL0_wght200_GRAD0_opsz24.svg";
    }
  });
}

export function addToFavorite() {
  const favoriteButton = document.querySelectorAll(".js-favorite-button");

  favoriteButton.forEach((button) => {
    button.addEventListener("click", () => {
      const { itemId } = button.dataset;
      const index = favoriteItem.findIndex((savedId) => savedId === itemId);

      if (index !== -1) {
        console.log("rmovd");
        favoriteItem.splice(index, 1);
      } else {
        console.log("added");
        favoriteItem.push(itemId);
      }

      saveToStorage();
      renderFavorite();
      updateFavoriteIcon();
    });
  });
}
