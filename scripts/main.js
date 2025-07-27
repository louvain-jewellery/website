import { loadHeader } from "./ui/render-header.js";
import { loadFooter } from "./ui/render-footer.js";
import { addToFavorite } from "./utils/favorites.js";

document.addEventListener("DOMContentLoaded", () => {
  loadHeader();
  loadFooter();

  const link = document.createElement("link");
  link.type = "stylesheet";
  link.src = "";
});
