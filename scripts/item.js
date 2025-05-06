document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get("id");

  if (!itemId) return;

  try {
    const response = await fetch("data/catalogue-data.json");
    const data = await response.json();
    const item = data.find(product => product.id === itemId);

    if (!item) return;

    // Update main image and thumbnails
    const mainImg = document.querySelector(".item-image-top");
    const thumbnails = document.querySelectorAll(".item-image");
    mainImg.src = item.images[0];
    thumbnails.forEach((img, index) => {
      img.src = item.images[index + 1] || item.images[0];
    });

    // Update name, description, price
    document.querySelector(".item-name").textContent = item.name;
    document.querySelector(".item-description").textContent = item.description;
    // document.querySelector(".price-tag").textContent = item.price;

    // Update specs table
    const table = document.querySelector(".detail-table");

    table.innerHTML = `
      <tr>
        <th>&#9642; &nbsp; Cincin</th>
        <td>Wanita</td>
        <td>Pria</td>
      </tr>
      <tr>
        <th>&#9642; &nbsp; Ring Width</th>
        <td>${item.specs.ringWidth.wanita}</td>
        <td>${item.specs.ringWidth.pria}</td>
      </tr>
      <tr>
        <th>&#9642; &nbsp; Gem</th>
        <td>${item.specs.gem.wanita}</td>
        <td>${item.specs.gem.pria}</td>
      </tr>
    `;

  } catch (error) {
    console.error("Failed to load item:", error);
  }

  // ========== Overlay Zoom Feature ==========
  const overlay = document.getElementById("overlay");
  const overlayImg = document.getElementById("overlayImg");
  const closeBtn = document.getElementById("closeOverlay");
  const clickableImages = document.querySelectorAll(".clickable-img");

  clickableImages.forEach(img => {
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

  let isZooming = false;
  const isTouchscreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;


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

  // Optional: mobile touch support
  overlayImg.addEventListener("touchstart", (e) => {
    isZooming = true;
    overlayImg.classList.add("zoomed");
    moveZoomOrigin(e.touches[0]);
  });

  overlayImg.addEventListener("touchmove", (e) => {
    if (isZooming) {
      moveZoomOrigin(e.touches[0]);
    }
  });

  overlayImg.addEventListener("touchend", () => {
    isZooming = false;
    overlayImg.classList.remove("zoomed");
  });

  overlayImg.addEventListener("dragstart", (e) => {
    e.preventDefault();
  });

  // Function to set zoom origin based on cursor position
  function moveZoomOrigin(e) {
    const rect = overlayImg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    overlayImg.style.transformOrigin = `${x}% ${y}%`;
  }

  if (!isTouchscreen) {
    overlayImg.addEventListener("mousemove", (e) => {
      const rect = overlayImg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xPercent = x / overlayImg.width * 100;
      const yPercent = y / overlayImg.height * 100;
      
      overlayImg.style.transform = `scale(2) translate(-${xPercent}%, -${yPercent}%)`;
    });
  
    overlayImg.addEventListener("mouseleave", () => {
      overlayImg.style.transform = "scale(1) translate(0, 0)";
    });
  } else {
    // If it's a touchscreen, we prevent zoom behavior entirely
    overlayImg.style.pointerEvents = "none"; // Disables interaction with the image on touch devices
  }

});

function sendToWhatsApp() {
  const itemName = document.querySelector('.item-name')?.innerText || 'Produk';
  const itemURL = window.location.href;

  const ringSizeW = document.querySelector('.ring-size-selection.woman')?.value || '-';
  const gemW = document.querySelector('.gem-selection.woman')?.value || '-';
  const chromeW = document.querySelector('.chrome-selection.woman')?.value || '-';
  const materialW = document.querySelector('.material-selection.woman')?.value || '-';
  const engravingW = document.querySelector('.engraving-box.woman')?.value || '-';

  const ringSizeM = document.querySelector('.ring-size-selection.man')?.value || '-';
  const gemM = document.querySelector('.gem-selection.man')?.value || '-';
  const chromeM = document.querySelector('.chrome-selection.man')?.value || '-';
  const materialM = document.querySelector('.material-selection.man')?.value || '-';
  const engravingM = document.querySelector('.engraving-box.man')?.value || '-';
  const notesBox = document.querySelector('.notes-box')?.value || '';

  const message = `
Halo, saya ingin memesan cincin dengan detail berikut:

Nama Produk: ${itemName}
Link Produk: ${itemURL}

• Cincin Wanita:
- Ukuran: ${ringSizeW}
- Gem: ${gemW}
- Chrome: ${chromeW}
- Material: ${materialW}
- Ukiran: ${engravingW}

• Cincin Pria:
- Ukuran: ${ringSizeM}
- Gem: ${gemM}
- Chrome: ${chromeM}
- Material: ${materialM}
- Ukiran: ${engravingM}

Pesan: ${notesBox}
  `;

  const encodedMessage = encodeURIComponent(message);
  const whatsappNumber = '6282174532606'; // ganti dengan nomor WA tujuan

  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  window.open(whatsappURL, '_blank');
}

// === TABLE DETAILS ===

function toggleTable(event) {
  const table = document.getElementById("detailTable");
  const button = event.target;
  const isHidden = getComputedStyle(table).display === "none";

  if (isHidden) {
    table.style.display = "table";
    button.style.marginBottom = "10px";
    button.textContent = "Detail Cincin ▴";
    // button.style.border = "none";
    // button.style.padding = "0";
  } else {
    table.style.display = "none";
    button.textContent = "Detail Cincin ▾";
    button.style.marginBottom = "50px";
    // button.style.borderBottom = "1px solid black";
    // button.style.padding = "0 0 2px 0";
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.item-image-slider');

  // Function to rearrange images on desktop
  function rearrangeImages() {
    if (window.innerWidth > 768) {
      // Create the thumbnail container if it doesn't exist
      let thumbnailContainer = slider.querySelector('.item-image-thumbnails');
      if (!thumbnailContainer) {
        thumbnailContainer = document.createElement('div');
        thumbnailContainer.classList.add('item-image-thumbnails');
        slider.appendChild(thumbnailContainer);
      }

      // Move thumbnails to the container
      const thumbnails = Array.from(slider.querySelectorAll('.item-image'));
      thumbnails.forEach(thumbnail => {
        thumbnailContainer.appendChild(thumbnail);
      });
    } else {
      // Revert to mobile layout (remove thumbnail container and show all images)
      let thumbnailContainer = slider.querySelector('.item-image-thumbnails');
      if (thumbnailContainer) {
        // Move thumbnails back to the slider
        const thumbnails = Array.from(thumbnailContainer.querySelectorAll('.item-image'));
        thumbnails.forEach(thumbnail => {
          slider.insertBefore(thumbnail, slider.lastElementChild); // Insert before the last element
        });

        thumbnailContainer.remove();
      }

      // Show the first thumbnail
      const firstThumbnail = slider.querySelector('.item-image-top');
      if (firstThumbnail) {
        firstThumbnail.style.display = 'block';
      }
    }
  }

  // Initial rearrangement
  rearrangeImages();

  // Rearrange on window resize
  window.addEventListener('resize', rearrangeImages);
});

document.addEventListener('DOMContentLoaded', () => {
  const favoriteButton = document.getElementById('favoriteButton');

  // Get item ID from URL or any other dynamic source
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('id');  // This gets the 'id' query parameter from the URL
  
  // Load the JSON data
  fetch('data/catalogue-data.json')
    .then(response => response.json())
    .then(data => {
      // Find the item by its ID from the JSON data
      const item = data.find(item => item.id === itemId);
      if (item) {
        favoriteButton.setAttribute('data-item-id', itemId);
        
        favoriteButton.addEventListener('click', () => {
          toggleFavorite(item);  // Pass the item data to the favorite toggle function
        });
        
        // Update initial button state
        updateFavoriteButtons(itemId);
      }
    })
    .catch(error => console.error('Error loading catalogue data:', error));
});
