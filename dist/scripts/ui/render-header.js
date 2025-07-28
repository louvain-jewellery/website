import {
  hideHeader,
  overlayUnderDropdown,
  showHamburgerMenu,
} from "../utils/header.js";
import { searchResult, showSearchInput } from "../utils/search.js";
import { renderDesign } from "../layout/render-design.js";

export function loadHeader() {
  document.getElementById("header").innerHTML = `
        <div class="header-top">
          <div class="header-top-left">
            <button id="hamburger" class="hamburger">&#9776;</button>
            <a class="header-text-button text-button" href="https://maps.app.goo.gl/Z3Q8pYDUb1qYTpas7" target="_blank">Lokasi</a>
            <a class="header-text-button text-button" href="https://wa.me/6285324922353" target="_blank">Hubungi Kami</a>
          </div>
      
          <div class="main-logo-container">
            <a href="./">
              <img class="main-logo" src="icons/main-logo4.png">
            </a>
          </div>
      
          <div class="header-top-right">
            <!-- <span class="account-name">Nama Akun</span> -->
            <!-- <img class="header-top-right-button account" src="icons/person_22dp_000000_FILL0_wght300_GRAD0_opsz24.svg"> -->
            <a class="header-top-right-button favorite" href="wishlist.html">
              <img class="header-top-right-button favorite-normal" src="icons/favorite_22dp_000000_FILL0_wght300_GRAD0_opsz24.svg">
      
              <img class="header-top-right-button favorite-hover" src="icons/favorite_22dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg">
            </a>
            <a id="searchBtn" class="header-top-right-button search">
              <img class="header-top-right-button search-normal" src="icons/search_22dp_000000_FILL0_wght300_GRAD0_opsz24.svg">
              <img class="header-top-right-button search-hover" src="icons/search_22dp_000000_FILL0_wght400_GRAD0_opsz24.svg">
            </a>
          </div>
        </div>
        <div id="mobileMenu" class="header-bottom">
          <div class="mobile-button-container">
            <a class="header-text-button mobile-button text-button" href="./">Beranda</a>
            <a href="./" class="mobile-arrow-button">
              <img src="icons/arrow_forward_ios_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="">
            </a>
          </div>
          
        <div class="drop-down koleksi-dropdown">
          <div class="mobile-button-container">
            <a href="collection.html" class="header-text-button mobile-button text-button">Koleksi</a>
            <a href="collection.html" class="mobile-arrow-button">
              <img src="icons/arrow_forward_ios_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="">
            </a>
          </div>
          <div class="dropdown-content koleksi-dropdown-content">
            <div class="dropdown-content-top js-design-wrapper"></div>
            <a class="dropdown-all-button text-button" href="collection.html">Lihat Semua Produk &gt;</a>
          </div>
        </div>
        <div class="mobile-button-container">
          <a class="header-text-button mobile-button text-button" href="about.html">Tentang Kami</a>
          <a href="about.html" class="mobile-arrow-button">
            <img src="icons/arrow_forward_ios_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="">
          </a>
        </div>
        <div class="mobile-button-container">
          <a class="header-text-button mobile-button text-button" href="production.html">Produksi</a>
          <a href="production.html" class="mobile-arrow-button">
            <img src="icons/arrow_forward_ios_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="">
          </a>
        </div>
        <div class="mobile-button-container">
          <a class="header-text-button mobile-button text-button" href="material.html">Material</a>
          <a href="material.html" class="mobile-arrow-button">
            <img src="icons/arrow_forward_ios_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="">
          </a>
        </div>
        </div>
        <div id="searchDropdown" class="dropdown-content search-dropdown">
          <div class="search-dropdown-top">
            <div class="search-box-container">
              <input id="searchBox" class="search-box" type="text" placeholder="Cari Produk">
              <img class="search-icon" src="icons/search_22dp_000000_FILL0_wght300_GRAD0_opsz24.svg" alt="search-icon">
            </div>
            <span id="closeBtn" class="close-btn">&#10005;</span>
          </div>
          <ul id="searchResults" class="results-list"></ul>
        </div>
      `;
  renderDesign({ slice: false });
  hideHeader();
  showHamburgerMenu();
  showSearchInput();
  overlayUnderDropdown();
  searchResult();
}
