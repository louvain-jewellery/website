document.addEventListener("DOMContentLoaded", function () {
  const scrollContainer = document.querySelector(".best-seller-content");
  const leftButton = document.querySelector(".left-button");
  const rightButton = document.querySelector(".right-button");

  function updateButtonVisibility() {
    // Check if at the start
    if (scrollContainer.scrollLeft === 0) {
      leftButton.classList.add("hidden");
    } else {
      leftButton.classList.remove("hidden");
    }

    // Check if at the end
    if (
      scrollContainer.scrollLeft + scrollContainer.clientWidth >=
      scrollContainer.scrollWidth - 1
    ) {
      rightButton.classList.add("hidden");
    } else {
      rightButton.classList.remove("hidden");
    }
  }

  // Initial check
  updateButtonVisibility();

  // Update on scroll
  scrollContainer.addEventListener("scroll", updateButtonVisibility);

  // Scroll buttons
  leftButton.addEventListener("click", () => {
    scrollContainer.scrollBy({
      left: -scrollContainer.offsetWidth * 1,
      behavior: "smooth",
    });
  });

  rightButton.addEventListener("click", () => {
    scrollContainer.scrollBy({
      left: scrollContainer.offsetWidth * 1,
      behavior: "smooth",
    });
  });

  fetch("data/catalogue-data.json")
    .then((response) => response.json())
    .then((data) => {
      renderBestSellers(data); // call the function to render the images
      updateButtonVisibility(); // update buttons again after images loaded
    })
    .catch((error) => {
      console.error("Failed to load best sellers data:", error);
    });
});

// Fetch data and populate recently videos
fetch("data/your-choices-data.json")
  .then((response) => response.json())
  .then((data) => {
    const gridWrapper = document.querySelector(".video-recently__grid-wrapper");

    // Get the first entry (recently videos)
    const recentlyData = data[0];

    if (!recentlyData) {
      throw new Error("No recently data found");
    }

    // Create the grid
    const grid = document.createElement("div");
    grid.className = "video-recently__grid";

    // Add videos to grid
    recentlyData.videos.slice(0, 4).forEach((videoUrl) => {
      const item = document.createElement("div");
      item.className = "video-recently__item";

      // Create video element
      const video = document.createElement("video");
      video.src = videoUrl;
      video.loop = true;
      video.muted = true;
      video.className = "video-recently__video";
      video.setAttribute("preload", "metadata");

      item.appendChild(video);

      // Create control buttons
      const muteBtn = document.createElement("button");
      muteBtn.className = "video-recently__mute-button video-button";
      muteBtn.innerHTML = `
        <img
          class="video-recently__mute-button-icon video-button-icon"
          src="icons/no_sound_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg"
        />
      `;

      const playBtn = document.createElement("button");
      playBtn.className = "video-recently__play-button video-button";
      playBtn.innerHTML = `
        <img
          class="video-recently__play-button-icon video-button-icon"
          src="icons/play_arrow_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg"
        />
      `;

      item.appendChild(muteBtn);
      item.appendChild(playBtn);

      grid.appendChild(item);
    });

    // Add grid to wrapper
    gridWrapper.appendChild(grid);

    // Get all videos for controls
    const allVideos = document.querySelectorAll(".video-recently__video");

    // MUTE TOGGLE
    document
      .querySelectorAll(".video-recently__mute-button")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const isMuted = allVideos[0].muted;
          allVideos.forEach((video) => (video.muted = !isMuted));

          document
            .querySelectorAll(".video-recently__mute-button-icon")
            .forEach((icon) => {
              icon.src = isMuted
                ? "icons/volume_up_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg"
                : "icons/no_sound_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg";
            });
        });
      });

    // PLAY/PAUSE TOGGLE
    document
      .querySelectorAll(".video-recently__play-button")
      .forEach((button, index) => {
        const video = allVideos[index];
        const icon = button.querySelector("img");

        button.addEventListener("click", () => {
          // Pause all other videos
          document.querySelectorAll("video").forEach((v) => {
            if (v !== video) v.pause();
          });

          if (video.paused) {
            video.play();
            icon.src = "icons/pause_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg";
          } else {
            video.pause();
            icon.src =
              "icons/play_arrow_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg";
          }
        });
      });
  })
  .catch((error) => {
    console.error("Error loading video data:", error);
    const gridWrapper = document.querySelector(".video-recently__grid-wrapper");
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent =
      "Failed to load video gallery. Please try again later.";
    gridWrapper.appendChild(errorDiv);
  });
