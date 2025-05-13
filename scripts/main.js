const header = document.getElementById("header");
const footer = document.getElementById("footer");

header.innerHTML = `
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
      <div class="dropdown-content-top">
        <div class="dropdown-koleksi-container">
          <a class="dropdown-image-link" href="collection.html?collection=timeless">
            <img src="images/timeless.png" alt="Timeless">
          </a>
          <a class="text-button" href="collection.html?collection=timeless">Timeless</a>
        </div>
        <div class="dropdown-koleksi-container">
          <a class="dropdown-image-link" href="collection.html?collection=stacking">
            <img src="images/stacking.png" alt="Stacking">
          </a>
          <a class="text-button" href="collection.html?collection=stacking">Stacking</a>
        </div>
        <div class="dropdown-koleksi-container">
          <a class="dropdown-image-link" href="collection.html?collection=couple">
            <img src="images/couple.png" alt="Couple">
          </a>
          <a class="text-button" href="collection.html?collection=couple">Couple</a>
        </div>
        <div class="dropdown-koleksi-container">
          <a class="dropdown-image-link" href="collection.html?collection=complement">
            <img src="images/complement.png" alt="Complement">
          </a>
          <a class="text-button" href="collection.html?collection=complement">Complement</a>
        </div>
        <div class="dropdown-koleksi-container">
          <a class="dropdown-image-link" href="collection.html?collection=independent">
            <img src="images/independent.png" alt="Independent">
          </a>
          <a class="text-button" href="collection.html?collection=independent">Independent</a>
        </div>
      </div>
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

footer.innerHTML = `
  <div class="footer-top">
    <div class="footer-left">
      <div class="footer-left-first">
        <h2 class="footer-title">
          Louvain Jewellery
        </h2>
        <a class="footer-left-button text-button" href="./">
          Beranda
        </a>
        <a class="footer-left-button text-button" href="collection.html">
          Koleksi
        </a>
        <a class="footer-left-button text-button" href="about.html">
          Tentang Kami
        </a>
        <a class="footer-left-button text-button" href="ring-size-guide.html">
          Panduan Ukuran Cincin
        </a>
        <a class="footer-left-button text-button" href="production.html">
          Produksi
        </a>
        <a class="footer-left-button text-button" href="material.html">
          Material
        </a>
      </div>

      <div class="footer-left-first">
        <h2 class="footer-title">
          Informasi Toko
        </h2>
        <a class="footer-left-button" href="https://maps.app.goo.gl/Z3Q8pYDUb1qYTpas7">
          Jl. Patimura, Kp. Jao, Kec. Padang Barat, Kota Padang, Sumatera Barat
        </a>
        <a class="footer-left-button">
          Senin - Minggu | 10.00 - 19.00 WIB
        </a>
        <a class="footer-left-button" href="wa.me/6285324922353">
          Whatsapp: 0853-2492-2353
        </a>
      </div>
    </div>

    <div class="footer-right">
      <h2 class="footer-title">Yang terbaru dari kami</h2>
      <!--<div class="footer-right-email">
        <input class="footer-email-box" type="text" placeholder="Masukkan Email Anda">
        <img src="icons/arrow_forward_24dp_000000_FILL0_wght400_GRAD0_opsz24 (1).svg">
      </div>-->
      <div class="footer-social-media">
        <a href="https://www.instagram.com/louvainjewellery" target="_blank">
          <img class="social-media-icon" src="icons/vecteezy_instagram-logo-png-instagram-icon-transparent_18930460.png">
        </a>
        <a href="https://www.tiktok.com/@louvainjewellery" target="_blank">
          <img class="social-media-icon" src="icons/vecteezy_tiktok-logo-png-tikok-icon-transparent-png-tikok-app-logo-png_18930701.png">
        </a>
        <a href="https://wa.me/6285324922353" target="_blank">
          <img class="social-media-icon" src="icons/vecteezy_whatsapp-logo-png-whatsapp-icon-png-whatsapp-transparent_18930462.png">
        </a>
      </div>
    </div>
  </div>

  <div class="footer-bottom">
    <p class="footer-copyright-text">
      &copy 2025 - Louvain Jewellery
    </p>
  </div>
`;