import { renderItem } from "../../scripts/layout/item/render-item.js";
import { scrollOverlay } from "../components/overlayScroll.js";
import { renderPackaging } from "../layout/render-packaging.js";
import {
  addToFavorite,
  loadFavorites,
  updateFavoriteIcon,
} from "../utils/favorites.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

renderItem(id);
renderPackaging();


