import { renderItem } from "../../scripts/layout/item/render-item.js";
import { scrollOverlay } from "../components/overlayScroll.js";
import { renderPackaging } from "../layout/render-packaging.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

renderItem(id);
renderPackaging();
