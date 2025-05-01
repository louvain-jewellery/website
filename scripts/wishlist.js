function renderWishlist() {
    const wishlistSection = document.getElementById('wishlistContentSection');
    const favorites = getFavorites();
    
    wishlistSection.innerHTML = '';
    
    if (favorites.length === 0) {
        wishlistSection.innerHTML = '<p class="empty-wishlist">Belum ada koleksi yang disukai</p>';
        return;
    }
    
    favorites.forEach(item => {
        const div = document.createElement('div');
        div.className = 'content-item';
        const favoriteIconSrc = isFavorited 
                ? "icons/favorite_22dp_1F1F1F_FILL1_wght300_GRAD0_opsz24.svg"
                : "icons/favorite_22dp_000000_FILL0_wght300_GRAD0_opsz24.svg";
        
        div.innerHTML = `
            <a class="content-image-link" href="${item.detailLink}">
                <img class="content-image" src="${item.images[0]}" alt="${item.name}">
            </a>
            <div class="content-overlay">
                <a class="content-image-link" href="${item.detailLink}">
                    <img class="content-image" src="${item.images[0]}" alt="${item.name}">
                </a>
                <button class="favorite-button" data-item-id="${item.id}">
                    <img src="${favoriteIconSrc}">
                </button>
                <h2 class="content-name-text">${item.name}</h2>
                <a class="content-button" href="${item.detailLink}">Lihat Produk</a>
            </div>
        `;
        
        const favoriteButton = div.querySelector('.favorite-button');
        favoriteButton.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFavorite(item);
            renderWishlist();
        });
        
        wishlistSection.appendChild(div);
    });
}

// Initialize wishlist when DOM is loaded
document.addEventListener('DOMContentLoaded', renderWishlist);
