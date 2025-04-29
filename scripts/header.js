let lastScrollY = window.scrollY;
const header = document.getElementById("header");
const searchDropdown = document.getElementById("searchDropdown");

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (screenWidth <= 768) {
    searchDropdown.style.top = '0';
  } else {
    if (currentScrollY > 105) { // only start hiding after scrolling 100px down
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        header.style.top = "-105px";
        header.style.borderBottom = "1px solid lightgray";
  
        searchDropdown.style.top = '0';
      } else {
        // Scrolling up
        header.style.top = "0";
        header.style.borderBottom = "none";
  
        searchDropdown.style.top = '85px';
      }
    } else {
      // Always show header when near top
      header.style.top = "0";
    }
  }

  lastScrollY = currentScrollY;
});


const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('show');
  hamburger.innerHTML = isOpen ? '&#10005;' : '&#9776;';

  // Toggle body scroll
  document.body.classList.toggle('no-scroll', isOpen);
});

// === SEARCH FEATURE ===
const closeButton = document.getElementById('closeBtn');
const searchButton = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchBox');

searchButton.addEventListener('click', () => {
  if (searchDropdown.style.display === 'flex') {
    searchDropdown.style.display = 'none';
  } else {
    searchDropdown.style.display = 'flex';
    searchInput.focus(); // <-- move cursor inside search input immediately
  }
});

closeBtn.addEventListener('click', () => {
  searchDropdown.style.display = 'none';
})


// Fetch catalogue data from the JSON file
async function loadItems() {
  const response = await fetch('data/catalogue-data.json');
  const items = await response.json();
  return items;
}

// Load items from the JSON file
async function loadItems() {
  const response = await fetch('data/catalogue-data.json');
  const items = await response.json();
  return items;
}

// Filter and display the items based on the search query
async function filterItems() {
  const input = document.getElementById('searchBox').value.toLowerCase(); // Corrected ID to match HTML
  const results = document.getElementById('searchResults');
  const items = await loadItems();  // Load the items from JSON

  const filteredItems = items.filter(item => item.name.toLowerCase().includes(input)); // Filter items by name

  results.innerHTML = ''; // Clear previous results
  if (input) {
    // Show the filtered items in the results list
    filteredItems.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.name; // Set the name of the item
      li.onclick = () => window.location.href = item.detailLink; // Redirect to the item page when clicked
      results.appendChild(li); // Append to the results list
    });
    results.style.display = filteredItems.length > 0 ? 'block' : 'none'; // Show dropdown if results found
  } else {
    results.style.display = 'none'; // Hide dropdown if input is empty
  }
}

// Add event listener to trigger filterItems when user types in the search box
document.getElementById('searchBox').addEventListener('input', filterItems);

document.addEventListener('click', function(event) {
  const isClickInside = searchDropdown.contains(event.target) || searchButton.contains(event.target);
  
  if (!isClickInside) {
    searchDropdown.style.display = 'none';
  }
});