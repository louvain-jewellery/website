import { renderBestSeller } from "../layout/index/render-best-sellers.js";
import { renderDesign } from "../layout/render-design.js";
import { renderPackaging } from "../layout/render-packaging.js";

renderBestSeller();
renderDesign();
renderPackaging();

document
  .getElementById("toPackagingSection")
  .addEventListener("click", (event) => {
    event.preventDefault();
    const packagingSection = document.getElementById("packagingSection");
    packagingSection.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });
