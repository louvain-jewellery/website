document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get("id");
  if (!itemId) return;

  try {
    const response = await fetch("data/catalogue-data.json");
    const data = await response.json();
    const item = data.find((product) => product.id === itemId);
    if (!item) return;

    // Collection-based descriptions
    const collectionDescriptions = {
      timeless:
        "Cincin kawin yang memiliki model abadi sepanjang masa. Identik dengan model basic dipadukan satu permata.",
      stacking:
        "Cincin kawin yang terdiri dari dua buah cincin digabungkan menjadi satu cincin dengan model yang berbeda satu sama lain.",
      couple:
        "Cincin kawin yang memiliki design sama persis antara cincin pria dan cincin wanita.",
      complement:
        "Cincin kawin yang memiliki didesain saling melengkapi antara cincin pria dan wanita. Dengan ciri khas cincin wanita memiliki permata yang lebih banyak.",
      independent:
        "Cincin kawin dengan model yag berbeda antara cincin pria dan wanita.",
    };
    item.description =
      collectionDescriptions[item.collection] || item.description;

    // Update images
    document.querySelector(".item-image-top").src = item.images[0];
    document.querySelectorAll(".item-image").forEach((img, i) => {
      img.src = item.images[i + 1] || item.images[0];
    });

    // Update text content
    document.querySelector(".item-name").textContent = item.name;
    document.querySelector(".item-description").textContent = item.description;
    document.querySelector(".price-tag").textContent = item.price;

    // Breadcrumb
    document.querySelector(".breadcrumb-navigation").innerHTML = `
      <a class="breadcrumb-item" href="collection.html">Koleksi</a>
      <a class="breadcrumb-item"> / </a>
      <a class="breadcrumb-item" href="item.html?id=${item.id}">${item.id}</a>
    `;

    // Design text
    const toSentenceCase = (text) =>
      text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    document.querySelector(".design-text-container").innerHTML = `
      <a class="design-text" href="">${toSentenceCase(
        `${item.collection} Design`
      )}</a>
    `;

    // Ring details
    const specs = item.specs || {};
    document.querySelector(".ring-width-women").innerHTML =
      specs.ringWidth?.wanita || "-";
    document.querySelector(".ring-width-men").innerText =
      specs.ringWidth?.pria || "-";
    document.querySelector(".gem-specs-women").innerText =
      specs.gem?.wanita || "-";
    document.querySelector(".gem-specs-men").innerText = specs.gem?.pria || "-";

    // Specs table
    document.querySelector(".detail-table").innerHTML = `
      <tr><th>&#9642; &nbsp; Cincin</th><td>Wanita</td><td>Pria</td></tr>
      <tr><th>&#9642; &nbsp; Ring Width</th><td>${
        specs.ringWidth?.wanita || "-"
      }</td><td>${specs.ringWidth?.pria || "-"}</td></tr>
      <tr><th>&#9642; &nbsp; Gem Spec</th><td>${
        specs.gem?.wanita || "-"
      }</td><td>${specs.gem?.pria || "-"}</td></tr>
      <tr><th>&#9642; &nbsp; Chrome</th><td>White<br>Rose<br>Yellow</td><td>White D/G<br>Rose D/G<br>Yellow D/G</td></tr>
      <tr><th>&#9642; &nbsp; Material</th><td>Platinum V<br>Platinum X<br>Gold 17k<br>Gold 16k</td><td>Platinum V<br>Platinum X</td></tr>
    `;
  } catch (error) {
    console.error("Failed to load item:", error);
  }

  // Zoom overlay
  const overlay = document.getElementById("overlay");
  const overlayImg = document.getElementById("overlayImg");
  const closeBtn = document.getElementById("closeOverlay");
  const clickableImages = document.querySelectorAll(".clickable-img");
  const isTouchscreen =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  clickableImages.forEach((img) => {
    img.addEventListener("click", () => {
      overlayImg.src = img.src;
      overlay.style.display = "flex";
    });
  });

  [closeBtn, overlay].forEach((el) =>
    el.addEventListener("click", (e) => {
      if (e.target === overlay || e.target === closeBtn)
        overlay.style.display = "none";
    })
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") overlay.style.display = "none";
  });

  if (!isTouchscreen) {
    let isZooming = false;
    overlayImg.addEventListener("mousedown", (e) => {
      isZooming = true;
      overlayImg.classList.add("zoomed");
      moveZoomOrigin(e);
    });
    overlayImg.addEventListener(
      "mousemove",
      (e) => isZooming && moveZoomOrigin(e)
    );
    ["mouseup", "mouseleave"].forEach((event) =>
      overlayImg.addEventListener(event, () => {
        isZooming = false;
        overlayImg.classList.remove("zoomed");
      })
    );
  }

  function moveZoomOrigin(e) {
    const rect = overlayImg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    overlayImg.style.transformOrigin = `${x}% ${y}%`;
  }

  document
    .querySelector(".order-button")
    .addEventListener("click", sendToWhatsApp);
  // This is the moved line
  document
    .querySelector(".table-title-text")
    .addEventListener("click", toggleTable);
});

function toggleTable(e) {
  const table = document.getElementById("detailTable");
  const btn = e.target;
  const isHidden = getComputedStyle(table).display === "none";
  table.style.display = isHidden ? "table" : "none";
  btn.style.marginBottom = isHidden ? "10px" : "50px";
  btn.textContent = `Detail Cincin ${isHidden ? "▴" : "▾"}`;
}

function sendToWhatsApp() {
  const getVal = (selector) => document.querySelector(selector)?.value || "-";
  const itemName = document.querySelector(".item-name")?.innerText || "Produk";
  const itemURL = window.location.href;

  const message = `
Halo, saya ingin memesan cincin dengan detail berikut:

Nama Produk: ${itemName}
Link Produk: ${itemURL}

• Cincin Wanita:
- Ukuran: ${getVal(".ring-size-selection.woman")}
- Gem: ${getVal(".gem-selection.woman")}
- Chrome: ${getVal(".chrome-selection.woman")}
- Material: ${getVal(".material-selection.woman")}
- Ukiran: ${getVal(".engraving-box.woman")}

• Cincin Pria:
- Ukuran: ${getVal(".ring-size-selection.man")}
- Gem: ${getVal(".gem-selection.man")}
- Chrome: ${getVal(".chrome-selection.man")}
- Material: ${getVal(".material-selection.man")}
- Ukiran: ${getVal(".engraving-box.man")}

Pesan: ${getVal(".notes-box")}`;

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/6282174532606?text=${encodedMessage}`, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".item-image-slider");

  function rearrangeImages() {
    const isDesktop = window.innerWidth > 768;
    let thumbnailContainer = slider.querySelector(".item-image-thumbnails");

    if (isDesktop) {
      if (!thumbnailContainer) {
        thumbnailContainer = document.createElement("div");
        thumbnailContainer.classList.add("item-image-thumbnails");
        slider.appendChild(thumbnailContainer);
      }

      Array.from(slider.querySelectorAll(".item-image")).forEach((img) => {
        thumbnailContainer.appendChild(img);
      });
    } else if (thumbnailContainer) {
      Array.from(thumbnailContainer.querySelectorAll(".item-image")).forEach(
        (img) => {
          slider.insertBefore(img, slider.lastElementChild);
        }
      );
      thumbnailContainer.remove();
      const first = slider.querySelector(".item-image-top");
      if (first) first.style.display = "block";
    }
  }

  rearrangeImages();
  window.addEventListener("resize", rearrangeImages);
});