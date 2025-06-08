document.addEventListener("DOMContentLoaded", function () {
  const scrollContainer = document.querySelector(".best-seller-content");
  const leftButton = document.querySelector(".left-button");
  const rightButton = document.querySelector(".right-button");

  function updateButtonVisibility() {
    // Check if at the start
    if (scrollContainer.scrollLeft === 0) {
      leftButton.classList.add("hidden");
    } else {
      leftButton.classList.remove("hidden");
    }

    // Check if at the end
    if (
      scrollContainer.scrollLeft + scrollContainer.clientWidth >=
      scrollContainer.scrollWidth - 1
    ) {
      rightButton.classList.add("hidden");
    } else {
      rightButton.classList.remove("hidden");
    }
  }

  // Initial check
  updateButtonVisibility();

  // Update on scroll
  scrollContainer.addEventListener("scroll", updateButtonVisibility);

  // Scroll buttons
  leftButton.addEventListener("click", () => {
    scrollContainer.scrollBy({
      left: -scrollContainer.offsetWidth * 1,
      behavior: "smooth",
    });
  });

  rightButton.addEventListener("click", () => {
    scrollContainer.scrollBy({
      left: scrollContainer.offsetWidth * 1,
      behavior: "smooth",
    });
  });
});
