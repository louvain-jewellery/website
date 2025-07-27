const urlParams = new URLSearchParams(window.location.search);
const collection = urlParams.get("collection");

const catalogueSection = document.querySelector(".catalogue-section");
const itemCountEl = document.querySelector(".breadcrumb-nav__item-count");
const collectionHeroTitle = document.querySelector(".page-hero__title-text");
const collectionHeroBody = document.querySelector(".page-hero__subtitle-text");
const collectionLinks = document.querySelectorAll(".design-nav__item-link");

// Define data for each collection
const collectionData = {
  timeless: {
    title: "Timeless Collection",
    description:
      "Cincin kawin yang memiliki model abadi sepanjang masa. Identik dengan model basic dipadukan satu permata.",
    image: "images/timeless.png",
  },
  stacking: {
    title: "Stacking Collection",
    description:
      "Cincin kawin yang terdiri dari dua buah cincin digabungkan menjadi satu cincin dengan model yang berbeda satu sama lain.",
    image: "images/stacking.png",
  },
  couple: {
    title: "Couple Collection",
    description:
      "Cincin kawin yang memiliki design sama persis antara cincin pria dan cincin wanita.",
    image: "images/couple.png",
  },
  complement: {
    title: "Complement Collection",
    description:
      "Cincin kawin yang memiliki didesain saling melengkapi antara cincin pria dan wanita. Dengan ciri khas cincin wanita memiliki permata yang lebih banyak.",
    image: "images/complement.png",
  },
  independent: {
    title: "Independent Collection",
    description:
      "Cincin kawin dengan model yag berbeda antara cincin pria dan wanita.",
    image: "images/independent.png",
  },
};

// Highlight the selected collection link with a border
collectionLinks.forEach((link) => {
  // Remove any existing selection first
  link.classList.remove("selected-collection");

  const href = link.getAttribute("href");
  const url = new URL(href, window.location.origin);
  const linkCollection = url.searchParams.get("collection");

  // Only add selection if there's an exact match and we're not in "all" view
  if (linkCollection === collection && collection && collection !== "all") {
    link.classList.add("selected-collection");
  }
});

function renderCatalogue(data) {
  let visibleCount = 0;

  // Set Hero Section
  if (collection && collectionData[collection]) {
    collectionHeroTitle.textContent = collectionData[collection].title;
    collectionHeroBody.textContent = collectionData[collection].description;
    const heroImage = document.querySelector(".page-hero__image");
    heroImage.src = collectionData[collection].image;
  } else {
    collectionHeroTitle.textContent = "Semua Koleksi";
    collectionHeroBody.textContent =
      "Jelajahi berbagai koleksi cincin pernikahan kami.";
    const heroImage = document.querySelector(".page-hero__image");
    heroImage.src = "images/logo.png";
  }

  // Clear existing items
  catalogueSection.innerHTML = "";

  // Loop through each item in the JSON data
  data.forEach((item) => {
    // Apply filtering based on collection
    if (!collection || collection === "all" || item.collection === collection) {
      visibleCount++;

      const div = document.createElement("div");
      div.className = "catalogue-item";
      div.dataset.collection = item.collection;

      div.innerHTML = `
				<a class="catalogue-image-link" href="${item.detailLink}">
					<img class="catalogue-image" src="${item.images[0]}" alt="${item.name}">
				</a>
				<div class="catalogue-overlay">
					<a class="catalogue-image-link-overlay" href="${item.detailLink}">
						<img class="catalogue-image-overlay" src="${item.images[0]}" alt="${item.name}">
					</a>
					<button class="favorite-button" data-item-id="${item.id}">
						<img src="${favoriteIconSrc}">
					</button>
					<h2 class="catalogue-name-text">${item.name}</h2>
					<a class="catalogue-button" href="${item.detailLink}">Lihat Produk</a>
				</div>
			`;

      catalogueSection.appendChild(div);
    }
  });

  // Update item count display
  const collectionName =
    collection && collection !== "all"
      ? collection.charAt(0).toUpperCase() + collection.slice(1)
      : "Semua Koleksi";
  itemCountEl.textContent = `${visibleCount} Produk${
    collection && collection !== "all" ? " " + collectionName : ""
  }`;

  const breadcrumbNav = document.querySelector(".breadcrumb-nav__item-wrapper");
  breadcrumbNav.innerHTML = `
          <li class="breadcrumb-nav__item">
            <a class="breadcrumb-nav__item-name" href="./">Beranda</a>
          </li>
          <li class="breadcrumb-nav__item">
            <a class="breadcrumb-nav__item-name">&nbsp; / &nbsp;</a>
          </li>
          <li class="breadcrumb-nav__item">
            <a class="breadcrumb-nav__item-name" href="collection.html"
              >Koleksi</a
            >
          </li>
          <li class="breadcrumb-nav__item">
            <a class="breadcrumb-nav__item-name">&nbsp; / &nbsp;</a>
          </li>
          <li class="breadcrumb-nav__item">
            <a class="breadcrumb-item" href="#">${collectionName}</a>
          </li>
  `;

  // Initialize image sizing
  adjustImageSizes();
}

function adjustImageSizes() {
  const images = document.querySelectorAll(".catalogue-item img");
  images.forEach((image) => {
    image.style.maxWidth = "100%";
    image.style.height = "auto";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("data/catalogue-data.json")
    .then((response) => response.json())
    .then((data) => renderCatalogue(data))
    .catch((error) => {
      console.error("Failed to load catalogue data:", error);
      catalogueSection.innerHTML =
        '<p class="error-message">Failed to load catalogue items. Please try again later.</p>';
    });
});

// Adjust image sizes on window load
window.addEventListener("load", adjustImageSizes);

// Add feedback styles if not already present
const style = document.createElement("style");
style.textContent = `
	.feedback-message {
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		background-color: #333;
		color: white;
		padding: 10px 20px;
		border-radius: 5px;
		z-index: 1000;
		animation: fadeInOut 2s ease-in-out;
	}

	@keyframes fadeInOut {
		0% { opacity: 0; }
		15% { opacity: 1; }
		85% { opacity: 1; }
		100% { opacity: 0; }
	}

	.error-message {
		text-align: center;
		padding: 20px;
		color: #ff0000;
	}
`;
document.head.appendChild(style);
