// Function to save favorites to localStorage
function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Function to get favorites from localStorage
function getFavorites() {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}

// Function to add/remove item to/from favorites
function toggleFavorite(item) {
  const favorites = getFavorites();
  const existingIndex = favorites.findIndex(fav => fav.id === item.id);
  
  if (existingIndex >= 0) {
      favorites.splice(existingIndex, 1);
  } else {
      favorites.push(item);
  }
  
  saveFavorites(favorites);
  updateFavoriteButtons(item.id);
  
  // Show feedback to user
  const message = existingIndex >= 0 ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit';
  showFeedback(message);
}

// Function to update favorite button appearances
function updateFavoriteButtons(itemId) {
  const favorites = getFavorites();
  const isFavorited = favorites.some(fav => fav.id === itemId);
  
  const buttons = document.querySelectorAll(`.favorite-button[data-item-id="${itemId}"]`);
  buttons.forEach(button => {
      const imgSrc = isFavorited 
          ? "icons/favorite_22dp_1F1F1F_FILL1_wght300_GRAD0_opsz24.svg"
          : "icons/favorite_22dp_000000_FILL0_wght300_GRAD0_opsz24.svg";
      button.querySelector('img').src = imgSrc;
  });
}

// Function to show feedback to user
function showFeedback(message) {
  const feedback = document.createElement('div');
  feedback.className = 'feedback-message';
  feedback.textContent = message;
  document.body.appendChild(feedback);
  
  setTimeout(() => {
      feedback.remove();
  }, 2000);
}
