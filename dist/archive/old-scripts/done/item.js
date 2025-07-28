document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get("id");

  if (!itemId) return;

  try {
    const response = await fetch("data/collection-data.json");
    const data = await response.json();
    const item = data.find((product) => product.id === itemId);

    if (!item) return;

    // Update main image and thumbnails
    const mainImg = document.querySelector(".item-images__main-image");
    const thumbnails = document.querySelectorAll(
      ".item-images__thumbnail-image"
    );
    mainImg.src = item.images[0];
    thumbnails.forEach((img, index) => {
      img.src = item.images[index + 1] || item.images[0];
    });

    // Update name, description, price
    document.querySelector(".item-details__item-name").textContent = item.name;
    document.querySelector(".item-details__item-description").textContent =
      item.description;
    document.querySelector(".price-tag").textContent = item.price;

    const breadcrumb = document.querySelector(".js-breadcrumb-nav");
    breadcrumb.innerHTML = `
      <a class="breadcrumb-item" href="collection.html">Koleksi</a>
      <a class="breadcrumb-item">&nbsp; / &nbsp;</a>
      <a class="breadcrumb-item" href="item.html?id=${item.id}">${item.id}</a>
    `;

    // Make the design text sentence case
    function toSentenceCase(text) {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    const rawText = `${item.collection} Design`;
    const sentenceCase = toSentenceCase(rawText);
    const designText = document.querySelector(".js-item-design");

    designText.innerHTML = `
    <a class="design-text" href="">${sentenceCase}</a>
    `;

    // Assigning detail content
    const ringWidthW = document.querySelector(".ring-width-women");
    const ringWidthM = document.querySelector(".ring-width-men");
    const gemSpecsW = document.querySelector(".gem-specs-women");
    const gemSpecsM = document.querySelector(".gem-specs-men");

    ringWidthW.innerHTML = `${item.specs.ringWidth.wanita}` || "-";
    ringWidthM.innerText = `${item.specs.ringWidth.pria}` || "-";
    gemSpecsW.innerText = `${item.specs.gem.wanita}` || "-";
    gemSpecsM.innerText = `${item.specs.gem.pria}` || "-";
  } catch (error) {
    console.error("Failed to load item:", error);
  }

  // ========== Overlay Zoom Feature ==========
  const overlay = document.getElementById("overlay");
  const overlayImg = document.getElementById("overlayImg");
  const closeBtn = document.getElementById("closeOverlay");
  const clickableImages = document.querySelectorAll(".clickable-img");

  // Detect if the device is a touchscreen
  const isTouchscreen =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  clickableImages.forEach((img) => {
    img.addEventListener("click", () => {
      overlayImg.src = img.src;
      overlay.style.display = "flex";
    });
  });

  closeBtn.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.style.display = "none";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      overlay.style.display = "none";
    }
  });

  if (!isTouchscreen) {
    let isZooming = false;

    overlayImg.addEventListener("mousedown", (e) => {
      isZooming = true;
      overlayImg.classList.add("zoomed");
      moveZoomOrigin(e);
    });

    overlayImg.addEventListener("mousemove", (e) => {
      if (isZooming) {
        moveZoomOrigin(e);
      }
    });

    overlayImg.addEventListener("mouseup", () => {
      isZooming = false;
      overlayImg.classList.remove("zoomed");
    });

    overlayImg.addEventListener("mouseleave", () => {
      isZooming = false;
      overlayImg.classList.remove("zoomed");
    });
  }

  // Function to set zoom origin based on cursor position
  function moveZoomOrigin(e) {
    const rect = overlayImg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    overlayImg.style.transformOrigin = `${x}% ${y}%`;
  }

  document
    .querySelector(".order-button")
    .addEventListener("click", sendToWhatsApp);
});

document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".item-images__wrapper");

  // Function to rearrange images on desktop
  function rearrangeImages() {
    if (window.innerWidth > 768) {
      // Create the thumbnail container if it doesn't exist
      let thumbnailContainer = slider.querySelector(".item-image-thumbnails");
      if (!thumbnailContainer) {
        thumbnailContainer = document.createElement("div");
        thumbnailContainer.classList.add("item-image-thumbnails");
        slider.appendChild(thumbnailContainer);
      }

      // Move thumbnails to the container
      const thumbnails = Array.from(
        slider.querySelectorAll(".item-images__thumbnail-image")
      );
      thumbnails.forEach((thumbnail) => {
        thumbnailContainer.appendChild(thumbnail);
      });
    } else {
      // Revert to mobile layout (remove thumbnail container and show all images)
      let thumbnailContainer = slider.querySelector(".item-image-thumbnails");
      if (thumbnailContainer) {
        // Move thumbnails back to the slider
        const thumbnails = Array.from(
          thumbnailContainer.querySelectorAll(".item-images__thumbnail-images")
        );
        thumbnails.forEach((thumbnail) => {
          slider.insertBefore(thumbnail, slider.lastElementChild); // Insert before the last element
        });

        thumbnailContainer.remove();
      }

      // Show the first thumbnail
      const firstThumbnail = slider.querySelector(".item-images__main-image");
      if (firstThumbnail) {
        firstThumbnail.style.display = "block";
      }
    }
  }

  // Initial rearrangement
  rearrangeImages();

  // Rearrange on window resize
  window.addEventListener("resize", rearrangeImages);
});

document.addEventListener("DOMContentLoaded", () => {
  const favoriteButton = document.getElementById("favoriteButton");

  // Get item ID from URL or any other dynamic source
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get("id"); // This gets the 'id' query parameter from the URL

  // Load the JSON data
  fetch("data/collection-data.json")
    .then((response) => response.json())
    .then((data) => {
      // Find the item by its ID from the JSON data
      const item = data.find((item) => item.id === itemId);
      if (item) {
        favoriteButton.setAttribute("data-item-id", itemId);

        favoriteButton.addEventListener("click", () => {
          toggleFavorite(item); // Pass the item data to the favorite toggle function
        });

        // Update initial button state
        updateFavoriteButtons(itemId);
      }
    })
    .catch((error) => console.error("Error loading catalogue data:", error));
});
