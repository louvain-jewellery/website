export function renderPageHero(collection) {
  const heroImage = document.querySelector(".js-hero-image");
  const heroTitle = document.querySelector(".js-hero-title");
  const heroSubtitle = document.querySelector(".js-hero-subtitle");

  fetch("data/design.json")
    .then((response) => response.json())
    .then((data) => {
      const collectionData = data[0];

      if (window.location.pathname.endsWith("best-sellers.html")) {
        heroImage.src = collectionData["best-sellers"].image;
        heroTitle.textContent =
          collectionData["best-sellers"].title + " Collection";
        heroSubtitle.textContent = collectionData["best-sellers"].description;
        return;
      } else if (collection && collectionData[collection]) {
        heroImage.src = collectionData[collection].image;
        heroTitle.textContent =
          collectionData[collection].title + " Collection";
        heroSubtitle.textContent = collectionData[collection].description;
      } else {
        heroImage.src = "images/logo.png";
        heroTitle.textContent = "Semua Koleksi";
        heroSubtitle.textContent =
          "Jelajahi berbagai koleksi cincin pernikahan kami.";
      }
    });
}
