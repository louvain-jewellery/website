window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  const screenWidth = window.innerWidth;
  const searchDropdown = document.getElementById("searchDropdown");

  if (screenWidth >= 769) {
    if (currentScroll > 105 && currentScroll > lastScroll) {
      header.style.top = "-105px";
      searchDropdown.style.top = "0px";
    } else {
      header.style.top = "0px";
      searchDropdown.style.top = "105px";
    }
  } else {
    header.style.top = "0px";
    searchDropdown.style.top = "50px";
  }

  lastScroll = currentScroll;
});

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("show");
  hamburger.innerHTML = isOpen ? "&#10005;" : "&#9776;";

  // Toggle body scroll
  document.body.classList.toggle("no-scroll", isOpen);
});

// === SEARCH FEATURE ===
const closeButton = document.getElementById("closeBtn");
const searchButton = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchBox");

searchButton.addEventListener("click", () => {
  if (searchDropdown.style.display === "flex") {
    searchDropdown.style.display = "none";
  } else {
    searchDropdown.style.display = "flex";
    searchInput.focus(); // <-- move cursor inside search input immediately
  }
});

closeBtn.addEventListener("click", () => {
  searchDropdown.style.display = "none";
});

// Fetch catalogue data from the JSON file
async function loadItems() {
  const response = await fetch("data/catalogue-data.json");
  const items = await response.json();
  return items;
}

// Load items from the JSON file
async function loadItems() {
  const response = await fetch("data/catalogue-data.json");
  const items = await response.json();
  return items;
}

// Filter and display the items based on the search query
async function filterItems() {
  const input = document.getElementById("searchBox").value.toLowerCase(); // Corrected ID to match HTML
  const results = document.getElementById("searchResults");
  const items = await loadItems(); // Load the items from JSON

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(input)
  ); // Filter items by name

  results.innerHTML = ""; // Clear previous results
  if (input) {
    // Show the filtered items in the results list
    filteredItems.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.name; // Set the name of the item
      li.onclick = () => (window.location.href = item.detailLink); // Redirect to the item page when clicked
      results.appendChild(li); // Append to the results list
    });
    results.style.display = filteredItems.length > 0 ? "block" : "none"; // Show dropdown if results found
  } else {
    results.style.display = "none"; // Hide dropdown if input is empty
  }
}

// Add event listener to trigger filterItems when user types in the search box
document.getElementById("searchBox").addEventListener("input", filterItems);

document.addEventListener("click", function (event) {
  const isClickInside =
    searchDropdown.contains(event.target) ||
    searchButton.contains(event.target);

  if (!isClickInside) {
    searchDropdown.style.display = "none";
  }
});

dropdownButton = document.querySelector(".koleksi-dropdown");
const overlay = document.querySelector(".overlay");

dropdownButton.addEventListener("mouseenter", () => {
  overlay.style.display = "block";
});

dropdownButton.addEventListener("mouseleave", () => {
  overlay.style.display = "none";
});
