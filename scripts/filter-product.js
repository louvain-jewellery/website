const sortByDropdown = document.querySelector(".sort-by");

sortByDropdown.addEventListener("click", () => {
  const sortOptions = ["Rekomendasi", "Harga Terendah", "Harga Tertinggi"];
  const currentSort = sortByDropdown.textContent.trim();

  const nextSortIndex = (sortOptions.indexOf(currentSort) + 1) % sortOptions.length;
  sortByDropdown.textContent = `Urutkan Berdasarkan: ${sortOptions[nextSortIndex]}`;

  // Re-sort the items based on the selected sort order
  sortCatalogueItems(sortOptions[nextSortIndex]);
});

function sortCatalogueItems(sortOption) {
  const items = Array.from(document.querySelectorAll(".catalogue-item"));
  
  let sortedItems;
  if (sortOption === "Harga Terendah") {
    sortedItems = items.sort((a, b) => parseFloat(a.querySelector("p").textContent.replace('Rp ', '').replace('.', '').replace(',', '.')) - parseFloat(b.querySelector("p").textContent.replace('Rp ', '').replace('.', '').replace(',', '.')));
  } else if (sortOption === "Harga Tertinggi") {
    sortedItems = items.sort((a, b) => parseFloat(b.querySelector("p").textContent.replace('Rp ', '').replace('.', '').replace(',', '.')) - parseFloat(a.querySelector("p").textContent.replace('Rp ', '').replace('.', '').replace(',', '.')));
  } else {
    sortedItems = items;  // Default: no sorting
  }

  // Clear and append sorted items
  catalogueSection.innerHTML = "";
  sortedItems.forEach(item => catalogueSection.appendChild(item));
}
