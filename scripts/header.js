// Declare lastScroll variable at the top
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  const screenWidth = window.innerWidth;
  const searchDropdown = document.getElementById("searchDropdown");
  const header = document.getElementById("header"); // Also declare header if not defined elsewhere

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
const searchDropdown = document.getElementById("searchDropdown");

searchButton.addEventListener("click", () => {
  if (searchDropdown.style.display === "flex") {
    searchDropdown.style.display = "none";
  } else {
    searchDropdown.style.display = "flex";
    searchInput.focus(); // <-- move cursor inside search input immediately
  }
});

closeButton.addEventListener("click", () => {
  // Fixed: was closeBtn, now closeButton
  searchDropdown.style.display = "none";
});

// Fetch catalogue data from the JSON file
async function loadItems() {
  const response = await fetch("data/catalogue-data.json");
  const items = await response.json();
  return items;
}

// Filter and display the items based on the search query
async function filterItems() {
  const input = document.getElementById("searchBox").value.toLowerCase();
  const results = document.getElementById("searchResults");
  const items = await loadItems();

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(input)
  );

  results.innerHTML = "";
  if (input) {
    filteredItems.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.name;
      li.onclick = () => (window.location.href = item.detailLink);
      results.appendChild(li);
    });
    results.style.display = filteredItems.length > 0 ? "block" : "none";
  } else {
    results.style.display = "none";
  }
}

document.getElementById("searchBox").addEventListener("input", filterItems);

document.addEventListener("click", function (event) {
  const isClickInside =
    searchDropdown.contains(event.target) ||
    searchButton.contains(event.target);

  if (!isClickInside) {
    searchDropdown.style.display = "none";
  }
});

const dropdownButton = document.querySelector(".koleksi-dropdown"); // Fixed: was missing const
const overlay = document.querySelector(".overlay");

dropdownButton.addEventListener("mouseenter", () => {
  overlay.style.display = "block";
});

dropdownButton.addEventListener("mouseleave", () => {
  overlay.style.display = "none";
});
