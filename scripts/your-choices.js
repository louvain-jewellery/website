// Function to create thumbnail from video first frame
function createThumbnail(video, callback) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  function captureFrame() {
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setTimeout(captureFrame, 100);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      function (blob) {
        const thumbnailUrl = URL.createObjectURL(blob);
        callback(thumbnailUrl);
      },
      "image/jpeg",
      0.8
    );
  }

  video.addEventListener("loadeddata", function () {
    video.currentTime = 0;
  });

  video.addEventListener("seeked", function () {
    captureFrame();
  });

  video.load();
}

// Function to create skeleton loader
function createSkeletonLoader(className) {
  const skeleton = document.createElement("div");
  skeleton.className = `${className} skeleton-loader`;
  skeleton.innerHTML = `
    <div class="skeleton-shimmer"></div>
  `;
  return skeleton;
}

// Function to show loading skeletons while data is being fetched
function showInitialSkeletons() {
  const videoSection = document.getElementById("videoSection");

  // Create recently section skeleton
  const recentlySection = document.createElement("section");
  recentlySection.className = "video-recently skeleton-section";

  const recentlyTitle = document.createElement("div");
  recentlyTitle.className = "skeleton-title";
  recentlySection.appendChild(recentlyTitle);

  const recentlyGrid = document.createElement("div");
  recentlyGrid.className = "video-recently__grid";

  // Add 4 skeleton items for recently section
  for (let i = 0; i < 4; i++) {
    const skeletonItem = createSkeletonLoader("video-recently__item");
    recentlyGrid.appendChild(skeletonItem);
  }

  recentlySection.appendChild(recentlyGrid);
  videoSection.appendChild(recentlySection);

  // Create monthly section skeleton
  const monthlySection = document.createElement("section");
  monthlySection.className = "video-monthly skeleton-section";

  const monthlyTitle = document.createElement("div");
  monthlyTitle.className = "skeleton-title";
  monthlySection.appendChild(monthlyTitle);

  const monthlyGrid = document.createElement("div");
  monthlyGrid.className = "video-monthly__grid";

  // Add 6 skeleton items for monthly section
  for (let i = 0; i < 6; i++) {
    const skeletonItem = createSkeletonLoader("video-monthly__item");
    monthlyGrid.appendChild(skeletonItem);
  }

  monthlySection.appendChild(monthlyGrid);
  videoSection.appendChild(monthlySection);
}

// Function to remove skeleton loaders
function removeSkeletons() {
  document.querySelectorAll(".skeleton-section").forEach((section) => {
    section.remove();
  });
}

// Show initial skeletons
showInitialSkeletons();

fetch("data/your-choices-data.json")
  .then((response) => response.json())
  .then((data) => {
    // Remove skeleton loaders
    removeSkeletons();

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

        if (isRecently) {
          // Add skeleton for recently videos while loading
          const videoSkeleton = createSkeletonLoader("video-recently__video");
          item.appendChild(videoSkeleton);

          // Keep recently videos as video elements (original behavior)
          const video = document.createElement("video");
          video.src = videoUrl;
          video.loop = true;
          video.muted = true;
          video.className = "video-recently__video";
          video.setAttribute("preload", "metadata");
          video.style.display = "none"; // Hide initially

          // Show video and remove skeleton when loaded
          video.addEventListener("loadeddata", () => {
            video.style.display = "block";
            videoSkeleton.remove();
          });

          // Handle loading error
          video.addEventListener("error", () => {
            videoSkeleton.remove();
            const errorDiv = document.createElement("div");
            errorDiv.className = "video-error";
            errorDiv.textContent = "Failed to load video";
            item.appendChild(errorDiv);
          });

          item.appendChild(video);

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
        } else {
          // For monthly videos, create thumbnail images with skeleton
          const thumbnailSkeleton = createSkeletonLoader(
            "video-monthly__video"
          );
          item.appendChild(thumbnailSkeleton);

          const img = document.createElement("img");
          img.className = "video-monthly__video";
          img.dataset.videoSrc = videoUrl;
          img.style.cursor = "pointer";
          img.style.display = "none"; // Hide initially
          img.alt = "Video thumbnail";

          // Create a hidden video element to generate thumbnail
          const hiddenVideo = document.createElement("video");
          hiddenVideo.style.position = "absolute";
          hiddenVideo.style.left = "-9999px";
          hiddenVideo.style.width = "1px";
          hiddenVideo.style.height = "1px";
          hiddenVideo.muted = true;
          hiddenVideo.preload = "metadata";
          hiddenVideo.src = videoUrl;
          document.body.appendChild(hiddenVideo);

          createThumbnail(hiddenVideo, function (thumbnailUrl) {
            img.src = thumbnailUrl;
            img.style.display = "block";
            thumbnailSkeleton.remove();
            document.body.removeChild(hiddenVideo);
          });

          // Handle thumbnail generation error
          hiddenVideo.addEventListener("error", () => {
            thumbnailSkeleton.remove();
            const errorDiv = document.createElement("div");
            errorDiv.className = "video-error";
            errorDiv.textContent = "Failed to load thumbnail";
            item.appendChild(errorDiv);
            document.body.removeChild(hiddenVideo);
          });

          item.appendChild(img);
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

    // Collect all the recently videos
    const allVideos = document.querySelectorAll(".video-recently__video");

    // MUTE TOGGLE — globally mute/unmute all recently videos
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

    // PLAY/PAUSE TOGGLE — per recently video
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

    // MONTHLY VIDEO FULLSCREEN OVERLAY ON CLICK (now for thumbnail images)
    document.querySelectorAll(".video-monthly__video").forEach((imgEl) => {
      imgEl.addEventListener("click", () => {
        overlay.classList.remove("hidden");
        overlayVideo.src = imgEl.dataset.videoSrc; // Use the original video source
        overlayVideo.currentTime = 0;
        overlayVideo.play();
      });
    });

    // 📱 If screen is small, tapping recently video triggers popup instead of inline play
    document.querySelectorAll(".video-recently__video").forEach((videoEl) => {
      videoEl.addEventListener("click", () => {
        if (window.innerWidth < 1024) {
          // Show popup on mobile
          overlay.classList.remove("hidden");
          overlayVideo.src = videoEl.dataset.src;
          overlayVideo.currentTime = videoEl.currentTime;
          overlayVideo.play();
        } else {
          // Normal inline play on desktop
          document.querySelectorAll("video").forEach((v) => {
            if (v !== videoEl) v.pause();
          });
          videoEl.play();
        }
      });
    });
  })
  .catch((error) => {
    console.error("Error loading video data:", error);
    // Remove skeletons and show error message
    removeSkeletons();
    const videoSection = document.getElementById("videoSection");
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent =
      "Failed to load video gallery. Please try again later.";
    videoSection.appendChild(errorDiv);
  });
