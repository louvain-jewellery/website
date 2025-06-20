const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const video = entry.target;
        if (video.dataset.src) {
          video.src = video.dataset.src;
          observer.unobserve(video);
        }
      }
    });
  },
  {
    rootMargin: "200px",
    threshold: 0.1,
  }
);

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
        video.dataset.src = videoUrl;
        video.muted = true;
        video.className = isRecently
          ? "video-recently__video"
          : "video-monthly__video";
        video.setAttribute("preload", "metadata");
        observer.observe(video);
        item.appendChild(video);

        if (isRecently) {
          const muteBtn = document.createElement("button");
          muteBtn.className = "video-recently__mute-button video-button";
          muteBtn.innerHTML = `
            <img
              class="video-recently__mute-button-icon video-button-icon"
              src="icons/no_sound_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg"
            />
          `;

          const fullBtn = document.createElement("button");
          fullBtn.className = "video-recently__full-screen-button video-button";
          fullBtn.textContent = "Full Screen";

          const playBtn = document.createElement("button");
          playBtn.className = "video-recently__play-button video-button";
          playBtn.innerHTML = `
            <img
              class="video-recently__play-button-icon video-button-icon"
              src="icons/play_arrow_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg"
            />
          `;

          item.appendChild(muteBtn);
          item.appendChild(fullBtn);
          item.appendChild(playBtn);
        }

        grid.appendChild(item);
      });

      if (isRecently) {
        gridWrapper.appendChild(grid);

        const leftBtn = document.createElement("button");
        leftBtn.className = "video-recently__left-scroll-button scroll-button";
        leftBtn.innerHTML = `
          <img
            class="video-recently__left-scroll-button-icon"
            src="icons/arrow_forward_ios_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
          />
        `;

        const rightBtn = document.createElement("button");
        rightBtn.className =
          "video-recently__right-scroll-button scroll-button";
        rightBtn.innerHTML = `
          <img
            class="video-recently__right-scroll-button-icon"
            src="icons/arrow_forward_ios_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
          />
        `;

        gridWrapper.appendChild(leftBtn);
        gridWrapper.appendChild(rightBtn);
        section.appendChild(gridWrapper);
        videoSection.appendChild(section);

        function updateButtonVisibility() {
          if (grid.scrollLeft === 0) {
            leftBtn.classList.add("hidden");
          } else {
            leftBtn.classList.remove("hidden");
          }

          if (grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 1) {
            rightBtn.classList.add("hidden");
          } else {
            rightBtn.classList.remove("hidden");
          }
        }

        updateButtonVisibility();

        grid.addEventListener("scroll", updateButtonVisibility);

        leftBtn.addEventListener("click", () => {
          grid.scrollBy({
            left: -grid.offsetWidth,
            behavior: "smooth",
          });
        });

        rightBtn.addEventListener("click", () => {
          grid.scrollBy({
            left: grid.offsetWidth,
            behavior: "smooth",
          });
        });
      } else {
        section.appendChild(grid);
        videoSection.appendChild(section);
      }
    });

    // Collect all the videos
    const allVideos = document.querySelectorAll(".video-recently__video");

    // MUTE TOGGLE — globally mute/unmute all
    document
      .querySelectorAll(".video-recently__mute-button")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const isMuted = allVideos[0].muted;
          allVideos.forEach((video) => (video.muted = !isMuted));

          // Update ALL mute icons
          document
            .querySelectorAll(".video-recently__mute-button-icon")
            .forEach((icon) => {
              icon.src = isMuted
                ? "icons/volume_up_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg"
                : "icons/no_sound_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg";
            });
        });
      });

    // PLAY/PAUSE TOGGLE — per video
    document
      .querySelectorAll(".video-recently__play-button")
      .forEach((button, index) => {
        const video = allVideos[index];
        const icon = button.querySelector("img");

        button.addEventListener("click", () => {
          // Pause ALL other videos first
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

    // FULLSCREEN POPUP
    const overlay = document.getElementById("videoOverlay");
    const overlayVideo = document.getElementById("overlayVideo");
    const closeOverlay = document.getElementById("closeOverlay");

    document
      .querySelectorAll(".video-recently__full-screen-button")
      .forEach((button, index) => {
        const video = allVideos[index];

        button.addEventListener("click", () => {
          overlay.classList.remove("hidden");
          overlayVideo.src = video.src;
          overlayVideo.currentTime = video.currentTime;
          overlayVideo.play();
        });
      });

    closeOverlay.addEventListener("click", () => {
      overlay.classList.add("hidden");
      overlayVideo.pause();
      overlayVideo.src = "";
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.add("hidden");
        overlayVideo.pause();
        overlayVideo.src = "";
      }
    });

    // MONTHLY VIDEO FULLSCREEN OVERLAY ON CLICK
    document.querySelectorAll(".video-monthly__video").forEach((videoEl) => {
      videoEl.addEventListener("click", () => {
        overlay.classList.remove("hidden");
        overlayVideo.src = videoEl.src;
        overlayVideo.currentTime = videoEl.currentTime;
        overlayVideo.play();
      });
    });
  });
