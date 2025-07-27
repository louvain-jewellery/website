export function renderDesign({ slice = true } = {}) {
  const designWrapper = document.querySelector(".js-design-wrapper");

  fetch("data/design.json")
    .then((response) => response.json())
    .then((data) => {
      const collections = slice
        ? Object.entries(data[0]).slice(1)
        : Object.entries(data[0]);
      collections.forEach(([key, collection]) => {
        
        const html = `
          <li class="design-nav__item">
            <a
              class="design-nav__item-link js-item-link"
              href="${collection.link}"
            >
              <img
                class="design-nav__item-image"
                src="${collection.image}"
                alt="${collection.title}"
              />
            </a>
            <a class="design-nav__item-name" href="${collection.link}"
              >${collection.title}</a
            >
          </li>
        `;
        designWrapper.insertAdjacentHTML("beforeend", html);
      });
    });
}
