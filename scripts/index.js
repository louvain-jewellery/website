const scrollContainer = document.querySelector('.best-seller-content');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');

leftButton.addEventListener('click', () => {
  scrollContainer.scrollBy({
    left: -scrollContainer.offsetWidth * 1,
    behavior: 'smooth'
  });
});

rightButton.addEventListener('click', () => {
  scrollContainer.scrollBy({
    left: scrollContainer.offsetWidth * 1,
    behavior: 'smooth'
  });
});

// Attach scroll event listener
window.addEventListener('scroll', updateOnScroll);

// Initial call to handle page load state
updateOnScroll();
