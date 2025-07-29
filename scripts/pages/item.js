import { renderItem } from "../../scripts/layout/item/render-item.js";
import { renderPackaging } from "../layout/render-packaging.js";
import { zoomHover } from "../utils/zoom-hover.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

document.querySelector(".js-ask-button").addEventListener("click", () => {
  window.open("https://wa.me/6285324922353", "_blank");
});

renderItem(id);
renderPackaging();
zoomHover();
