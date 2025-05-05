// Handle both image and text transitions on scroll
const elements = document.querySelectorAll('.image-transition, .text-transition');

function updateOnScroll() {
  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const elementHeight = element.offsetHeight;
    
    // Check if the element is in the viewport
    const isInViewport = rect.top >= 0 && rect.top <= window.innerHeight;
    
    // Calculate the visibility percentage
    const visiblePercentage = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / elementHeight));

    // Image transition: Adjust padding based on visibility
    if (element.classList.contains('image-transition')) {
      const newPadding = 50 * (1 - visiblePercentage); // Initial padding = 50
      element.style.padding = `${newPadding}px`;
    }
    
    // Text transition: Handle opacity change for text
    if (element.classList.contains('text-transition')) {
      if (isInViewport) {
        element.classList.add('visible');  // Fade in
      } else {
        element.classList.remove('visible');  // Fade out
      }
    }
  });
}

// Attach scroll event listener
window.addEventListener('scroll', updateOnScroll);

// Initial call to handle page load state
updateOnScroll();
