export function showSearchInput() {
  const closeButton = document.getElementById("closeBtn");
  const searchButton = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchBox");
  const searchDropdown = document.getElementById("searchDropdown");

  searchButton.addEventListener("click", () => {
    if (searchDropdown.style.display === "flex") {
      searchDropdown.style.display = "none";
    } else {
      searchDropdown.style.display = "flex";
      searchInput.focus();
    }
  });

  closeButton.addEventListener("click", () => {
    searchDropdown.style.display = "none";
  });
}

async function loadItems() {
  const response = await fetch("data/catalogue-data.json");
  const items = await response.json();
  return items;
}

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

export function searchResult() {
  document.getElementById("searchBox").addEventListener("input", filterItems);

  document.addEventListener("click", (event) => {
    const searchButton = document.getElementById("searchBtn");
    const searchDropdown = document.getElementById("searchDropdown");

    if (!searchDropdown || !searchButton) return;

    const isClickInside =
      searchDropdown.contains(event.target) ||
      searchButton.contains(event.target);

    if (!isClickInside) {
      searchDropdown.style.display = "none";
    }
  });
}
