const urlParams = new URLSearchParams(window.location.search);
const collection = urlParams.get("collection");

const catalogueSection = document.querySelector(".catalogue-section");
const itemCountEl = document.querySelector(".item-count");
const collectionHeroTitle = document.querySelector(".collection-hero-title-text");
const collectionHeroBody = document.querySelector(".collection-hero-body-text");
const filterSection = document.querySelector(".filter-section");
const collectionLinks = document.querySelectorAll(".design-image-link");

// Define data for each collection
const collectionData = {
  timeless: {
    title: "Timeless Collection",
    description: "cincin kawin yang memiliki model abadi sepanjang masa. Identik dengan model basic dipadukan satu permata.",
    image: "images/timeless.png"
  },
  stacking: {
    title: "Stacking Collection",
    description: "cincin kawin yang terdiri dari dua buah cincin digabungkan menjadi satu cincin dengan model yang berbeda satu sama lain.",
    image: "images/stacking.png"
  },
  couple: {
    title: "Couple Collection",
    description: "Cincin kawin yang memiliki design sama persis antara cincin pria dan cincin wanita.",
    image: "images/couple.png"
  },
  complement: {
    title: "Complement Collection",
    description: "Cincin kawin yang memiliki didesain saling melengkapi antara cincin pria dan wanita. Dengan ciri khas cincin wanita memiliki permata yang lebih banyak",
    image: "images/complement.png"
  },
  independent: {
    title: "Independent Collection",
    description: "Cincin kawin dengan model yag berbeda antara cincin pria dan wanita. ",
    image: "images/independent.png"
  }
};

// Highlight the selected collection link with a border
collectionLinks.forEach(link => {
  const href = link.getAttribute("href");
  const url = new URL(href, window.location.origin);
  const linkCollection = url.searchParams.get("collection");

  if (linkCollection === collection) {
    link.classList.add("selected-collection");
  }
});

fetch("data/catalogue-data.json")
  .then(response => response.json())
  .then(data => {
    let visibleCount = 0;

    // Set Hero Section
    if (collection && collectionData[collection]) {
      collectionHeroTitle.textContent = collectionData[collection].title;
      collectionHeroBody.textContent = collectionData[collection].description;
      const heroImage = document.querySelector(".collection-hero-image");
      heroImage.src = collectionData[collection].image;
    } else {
      collectionHeroTitle.textContent = "Semua Koleksi";
      collectionHeroBody.textContent = "Jelajahi berbagai koleksi cincin pernikahan kami.";
      const heroImage = document.querySelector(".collection-hero-image");
      heroImage.src = "images/logo.png"; // Default image
    }

    // Loop through each item in the JSON data
    data.forEach(item => {
      // Apply filtering based on collection
      if (!collection || collection === "all" || item.collection === collection) {
        visibleCount++;

        // Create catalogue item div and fill it with product data
        const div = document.createElement("div");
        div.className = "catalogue-item";
        div.dataset.collection = item.collection;


        // <p class="catalogue-price-text">${item.price}</p>

        
        div.innerHTML = `
          <a class="catalogue-image-link" href="${item.detailLink}">
          <img class="catalogue-image" src="${item.images[0]}" alt="${item.name}">
          </a>
          <div class="catalogue-overlay">
            <a class="catalogue-image-link" href="${item.detailLink}">
            <img class="catalogue-image" src="${item.images[0]}" alt="${item.name}">
            </a>
            <h2 class="catalogue-name-text">${item.name}</h2>
            
            <a class="catalogue-button" href="${item.detailLink}">Lihat Produk</a>
          </div>
        `;

        catalogueSection.appendChild(div);
      }
    });

    // Update item count display based on the visible count
    const collectionName = collection ? collection.charAt(0).toUpperCase() + collection.slice(1) : "Semua";
    itemCountEl.textContent = `${visibleCount} Produk${collection ? " " + collectionName : ""}`;
  })
  .catch(error => {
    console.error("Failed to load catalogue data:", error);
  });

// Adjust image sizes to fit the grid
window.addEventListener('load', function () {
  const images = document.querySelectorAll('.catalogue-item img');
  images.forEach(image => {
    // Ensure the image width is no larger than its container
    image.style.maxWidth = '100%';
    image.style.height = 'auto';
  });
});
