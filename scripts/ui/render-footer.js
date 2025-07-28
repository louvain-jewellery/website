export function loadFooter() {
  document.getElementById("footer").innerHTML = `
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
        <div class="footer-social-media">
          <a href="https://www.instagram.com/Louvainjewellery" target="_blank">
            <img class="social-media-icon" src="icons/vecteezy_instagram-logo-png-instagram-icon-transparent_18930460.png">
          </a>
          <a href="https://www.tiktok.com/@Louvainjewellery" target="_blank">
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
}
