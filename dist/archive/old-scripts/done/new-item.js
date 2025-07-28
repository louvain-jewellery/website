document.addEventListener("DOMContentLoaded", function () {
  const imagesContainer = document.querySelector(".images-container");
  const mainImageWrapper = document.querySelector(".");

  function setThumbnailSizes() {
    const itemImages = imagesContainer.querySelectorAll(".item-image");
    if (itemImages.length === 0) return;

    const containerHeight = imagesContainer.clientHeight;
    const numberOfImages = itemImages.length;

    const gapStyle = getComputedStyle(imagesContainer).gap;
    const gapValue = parseFloat(gapStyle); // Extracts '0.6'
    const gapUnit = gapStyle.replace(/[0-9.]/g, ""); // Extracts 'rem'

    let actualGapPx = 0;
    if (gapUnit === "rem") {
      actualGapPx =
        gapValue *
        parseFloat(getComputedStyle(document.documentElement).fontSize);
    } else if (gapUnit === "px") {
      actualGapPx = gapValue;
    }
    const totalGapHeight = (numberOfImages - 1) * actualGapPx;

    const availableImageHeight = containerHeight - totalGapHeight;

    const thumbnailHeight = availableImageHeight / numberOfImages;

    imagesContainer.style.setProperty(
      "--thumbnail-height",
      `${thumbnailHeight}px`
    );
  }

  setThumbnailSizes();
  window.addEventListener("resize", setThumbnailSizes);

  mainImageWrapper
    .querySelector(".main-image")
    .addEventListener("load", setThumbnailSizes);
});
