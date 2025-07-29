import { renderVideos } from "../layout/best-sellers/render-videos.js";
import { renderDesign } from "../layout/render-design.js";
import { renderPageHero } from "../layout/render-page-hero.js";

renderPageHero();
renderDesign({ slice: false });
renderVideos();
