fetch("data/your-choices-data.json")
  .then((response) => response.json())
  .then((data) => {
    const videoSection = document.getElementById("videoSection");

    data.forEach((entry, index) => {
      const isRecently = index === 0;

      const section = document.createElement("section");
      section.className = isRecently ? "video-recently" : "video-monthly";

      const title = document.createElement("h2");
      title.className = isRecently
        ? "video-recently__title"
        : "video-monthly__title";
      title.textContent = entry.month;
      section.appendChild(title);

      const gridWrapper = isRecently ? document.createElement("div") : null;
      if (isRecently) gridWrapper.className = "video-recently__grid-wrapper";

      const grid = document.createElement("div");
      grid.className = isRecently
        ? "video-recently__grid"
        : "video-monthly__grid";

      entry.videos.forEach((videoUrl) => {
        const item = document.createElement("div");
        item.className = isRecently
          ? "video-recently__item"
          : "video-monthly__item";

        const video = document.createElement("video");
        video.src = videoUrl;
        video.muted = true;
        video.className = isRecently
          ? "video-recently__video"
          : "video-monthly__video";
        video.setAttribute("loading", "lazy");
        video.setAttribute("preload", "metadata");
        item.appendChild(video);

        if (isRecently) {
          item.innerHTML += `
          <button class="video-recently__mute-button video-button">
            <img
              class="video-recently__mute-button-icon video-button-icon"
              src="icons/no_sound_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg"
            />
          </button>
          <button class="video-recently__full-screen-button video-button">
            Full Screen
          </button>
          <button class="video-recently__play-button video-button">
            <img
              class="video-recently__play-button-icon video-button-icon"
              src="icons/play_arrow_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg"
            />
          </button>
        `;
        }
        grid.appendChild(item);
      });

      if (isRecently) {
        gridWrapper.appendChild(grid);

        gridWrapper.innerHTML += `
          <button class="video-recently__left-scroll-button scroll-button">
              <img
                class="video-recently__left-scroll-button-icon"
                src="icons/arrow_forward_ios_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
              />
            </button>
            <button class="video-recently__right-scroll-button scroll-button">
              <img
                class="video-recently__right-scroll-button-icon"
                src="icons/arrow_forward_ios_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
              />
            </button>
        `;

        section.appendChild(gridWrapper);
      } else {
        section.appendChild(grid);
      }

      videoSection.appendChild(section);
    });
  });
