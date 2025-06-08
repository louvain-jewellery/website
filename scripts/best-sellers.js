const urlParams = new URLSearchParams(window.location.search);
const collection = urlParams.get("collection");

const catalogueSection = document.querySelector(".catalogue-section");
const itemCountEl = document.querySelector(".item-count");
const collectionHeroTitle = document.querySelector(".collection-hero-title-text");
const collectionHeroBody = document.querySelector(".collection-hero-body-text");
const filterSection = document.querySelector(".filter-section");
const collectionLinks = document.querySelectorAll(".design-image-link");

function renderCatalogue(data) {
	let visibleCount = 0;

	// Clear existing items
	catalogueSection.innerHTML = '';

	// Loop through each item in the JSON data
	data.forEach(item => {
		// Show only best-sellers items
		if (item.collection === 'best-sellers') {
			visibleCount++;

			const div = document.createElement("div");
			div.className = "catalogue-item";
			div.dataset.collection = item.collection;

			// Check if item is in favorites
			const favorites = getFavorites();
			const isFavorited = favorites.some(fav => fav.id === item.id);
			const favoriteIconSrc = isFavorited 
				? "icons/favorite_22dp_1F1F1F_FILL1_wght300_GRAD0_opsz24.svg"
				: "icons/favorite_22dp_000000_FILL0_wght300_GRAD0_opsz24.svg";

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

			const favoriteButton = div.querySelector('.favorite-button');
			favoriteButton.addEventListener('click', (e) => {
				e.preventDefault();
				e.stopPropagation();
				toggleFavorite(item);
			});

			catalogueSection.appendChild(div);
		}
	});

	// Update item count display
	itemCountEl.textContent = `${visibleCount} Produk`;

	// Initialize image sizing
	adjustImageSizes();
}

function adjustImageSizes() {
	const images = document.querySelectorAll('.catalogue-item img');
	images.forEach(image => {
		image.style.maxWidth = '100%';
		image.style.height = 'auto';
	});
}

document.addEventListener('DOMContentLoaded', () => {
	fetch("data/catalogue-data.json")
		.then(response => response.json())
		.then(data => renderCatalogue(data))
		.catch(error => {
			console.error("Failed to load catalogue data:", error);
			catalogueSection.innerHTML = '<p class="error-message">Failed to load catalogue items. Please try again later.</p>';
		});
});
  
// Adjust image sizes on window load
window.addEventListener('load', adjustImageSizes);

// Add feedback styles if not already present
const style = document.createElement('style');
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