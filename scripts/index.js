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

  fetch("data/catalogue-data.json")
    .then((response) => response.json())
    .then((data) => {
      renderBestSellers(data); // call the function to render the images
      updateButtonVisibility(); // update buttons again after images loaded
    })
    .catch((error) => {
      console.error("Failed to load best sellers data:", error);
    });

  // function renderBestSellers(data) {
  //   // Filter bestSellers collection
  //   const bestSellers = data.filter(
  //     (item) => item.collection === "bestSellers"
  //   );

  //   // Build the HTML string
  //   let html = "";

  //   bestSellers.slice(0, 10).forEach((item) => {
  //     html += `
  //       <a class="best-seller-link" href="item.html?id=${encodeURIComponent(
  //         item.id
  //       )}">
  //         <img class="best-seller-image" src="${item.images[0]}" alt="${
  //       item.name || ""
  //     }" />
  //       </a>
  //     `;
  //   });

  //   // Inject into the container
  //   scrollContainer.innerHTML = html;
  // }
});
