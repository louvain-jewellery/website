import { renderDesign } from "../layout/render-design.js";
import { renderCatalogue } from "../layout/collection/render-catalogue.js";
import { renderPageHero } from "../layout/render-page-hero.js";

const urlParams = new URLSearchParams(window.location.search);
const collection = urlParams.get("collection");

renderPageHero(collection);
renderDesign({ slice: false });
renderCatalogue(collection);
