export function hideHeader() {
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const searchDropdown = document.getElementById("searchDropdown");
    const header = document.getElementById("header");

    if (window.innerWidth >= 769) {
      if (window.scrollY > 105 && window.scrollY > lastScroll) {
        header.style.top = "-105px";
        searchDropdown.style.top = "0px";
      } else {
        header.style.top = 0;
        searchDropdown.style.top = "50px";
      }
    } else {
      header.style.top = 0;
      searchDropdown.style.top = "105px";
    }

    lastScroll = window.scrollY;
  });
}

export function showHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("show");
    hamburger.innerHTML = isOpen ? "&#10005;" : "&#9776;";

    document.body.classList.toggle("no-scroll", isOpen);
  });
}

export function overlayUnderDropdown() {
  const dropdownButton = document.querySelector(".koleksi-dropdown");
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  document.body.appendChild(overlay);

  dropdownButton.addEventListener("mouseenter", () => {
    overlay.style.display = "block";
  });

  dropdownButton.addEventListener("mouseleave", () => {
    overlay.style.display = "none";
  });
}
