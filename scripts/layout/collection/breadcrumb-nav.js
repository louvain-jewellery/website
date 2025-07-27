export function breadcrumbNav(collection) {
  const breadcrumbWrapper = document.querySelector(
    ".js-breadcrumb-nav-wrapper"
  );
  const collectionName = collection
    ? collection.charAt(0).toUpperCase() + collection.slice(1)
    : "Semua Koleksi";

  breadcrumbWrapper.innerHTML = `
    <li class="breadcrumb-nav__item">
      <a class="breadcrumb-nav__item-name" href="./">Beranda</a>
    </li>
    <li class="breadcrumb-nav__item">
      <a class="breadcrumb-nav__item-name" href="collection.html"
        >Koleksi</a>
    </li>
    <li class="breadcrumb-nav__item">
      <a class="breadcrumb-item" href="#">${collectionName}</a>
    </li>
  `;
}
