// Key performance optimizations applied to original structure:
// 1. Canvas reuse for thumbnails
// 2. DocumentFragment for batch DOM operations  
// 3. Event delegation for video controls
// 4. Debounced scroll handling
// 5. Intersection Observer for lazy loading
// 6. Thumbnail caching

// Shared resources for performance
const sharedCanvas = document.createElement("canvas");
const thumbnailCache = new Map();
let scrollDebounceTimer = null;

// Intersection Observer for lazy loading
const lazyLoadObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadLazyVideo(entry.target);
      lazyLoadObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '50px', threshold: 0.1 });

// Optimized thumbnail creation with canvas reuse
function createThumbnail(video, callback) {
  const ctx = sharedCanvas.getContext("2d");

  function captureFrame() {
    requestAnimationFrame(() => {
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setTimeout(captureFrame, 100);
        return;
      }

      sharedCanvas.width = video.videoWidth;
      sharedCanvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, sharedCanvas.width, sharedCanvas.height);

      sharedCanvas.toBlob(
        function (blob) {
          const thumbnailUrl = URL.createObjectURL(blob);
          callback(thumbnailUrl);
        },
        "image/jpeg",
        0.8
      );
    });
  }

  video.addEventListener("loadeddata", function () {
    video.currentTime = 0;
  });

  video.addEventListener("seeked", function () {
    captureFrame();
  });

  video.load();
}

function createSkeletonLoader(className) {
  const skeleton = document.createElement("div");
  skeleton.className = `${className} skeleton-loader`;
  skeleton.innerHTML = `<div class="skeleton-shimmer"></div>`;
  return skeleton;
}

// Batch DOM operations with DocumentFragment
function showInitialSkeletons() {
  const videoSection = document.getElementById("videoSection");
  const fragment = document.createDocumentFragment();

  // Recently section skeleton
  const recentlySection = document.createElement("section");
  recentlySection.className = "video-recently skeleton-section";

  const recentlyTitle = document.createElement("div");
  recentlyTitle.className = "skeleton-title";
  recentlySection.appendChild(recentlyTitle);

  const recentlyGrid = document.createElement("div");
  recentlyGrid.className = "video-recently__grid";

  // Batch create skeleton items
  const recentlyFragment = document.createDocumentFragment();
  for (let i = 0; i < 4; i++) {
    const skeletonItem = createSkeletonLoader("video-recently__item");
    recentlyFragment.appendChild(skeletonItem);
  }
  recentlyGrid.appendChild(recentlyFragment);
  recentlySection.appendChild(recentlyGrid);
  fragment.appendChild(recentlySection);

  // Monthly section skeleton
  const monthlySection = document.createElement("section");
  monthlySection.className = "video-monthly skeleton-section";

  const monthlyTitle = document.createElement("div");
  monthlyTitle.className = "skeleton-title";
  monthlySection.appendChild(monthlyTitle);

  const monthlyGrid = document.createElement("div");
  monthlyGrid.className = "video-monthly__grid";

  // Batch create skeleton items
  const monthlyFragment = document.createDocumentFragment();
  for (let i = 0; i < 6; i++) {
    const skeletonItem = createSkeletonLoader("video-monthly__item");
    monthlyFragment.appendChild(skeletonItem);
  }
  monthlyGrid.appendChild(monthlyFragment);
  monthlySection.appendChild(monthlyGrid);
  fragment.appendChild(monthlySection);

  videoSection.appendChild(fragment);
}

function removeSkeletons() {
  document.querySelectorAll(".skeleton-section").forEach((section) => {
    section.remove();
  });
}

// Lazy loading function
function loadLazyVideo(item) {
  const videoUrl = item.dataset.videoSrc;
  const skeleton = item.querySelector('.skeleton-loader');
  const isRecently = item.classList.contains('video-recently__item');

  if (isRecently) {
    // Load recently video
    const video = document.createElement("video");
    video.src = videoUrl;
    video.loop = true;
    video.muted = true;
    video.className = "video-recently__video";
    video.setAttribute("preload", "metadata");
    video.style.display = "none";

    video.addEventListener("loadeddata", () => {
      video.style.display = "block";
      if (skeleton) skeleton.remove();
    });

    video.addEventListener("error", () => {
      if (skeleton) skeleton.remove();
      const errorDiv = document.createElement("div");
      errorDiv.className = "video-error";
      errorDiv.textContent = "Failed to load video";
      item.appendChild(errorDiv);
    });

    item.appendChild(video);
    
    // Add controls
    const controlsFragment = document.createDocumentFragment();
    
    const muteBtn = document.createElement("button");
    muteBtn.className = "video-recently__mute-button video-button";
    muteBtn.innerHTML = `
      <img class="video-recently__mute-button-icon video-button-icon"
           src="icons/no_sound_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg" />
    `;

    const fullBtn = document.createElement("button");
    fullBtn.className = "video-recently__full-screen-button video-button";
    fullBtn.textContent = "Full Screen";

    const playBtn = document.createElement("button");
    playBtn.className = "video-recently__play-button video-button";
    playBtn.innerHTML = `
      <img class="video-recently__play-button-icon video-button-icon"
           src="icons/play_arrow_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg" />
    `;

    controlsFragment.appendChild(muteBtn);
    controlsFragment.appendChild(fullBtn);
    controlsFragment.appendChild(playBtn);
    item.appendChild(controlsFragment);
  } else {
    // Load monthly thumbnail with caching
    if (thumbnailCache.has(videoUrl)) {
      const img = document.createElement("img");
      img.className = "video-monthly__video";
      img.src = thumbnailCache.get(videoUrl);
      img.dataset.videoSrc = videoUrl;
      img.style.cursor = "pointer";
      img.alt = "Video thumbnail";
      item.appendChild(img);
      if (skeleton) skeleton.remove();
      return;
    }

    const img = document.createElement("img");
    img.className = "video-monthly__video";
    img.dataset.videoSrc = videoUrl;
    img.style.cursor = "pointer";
    img.style.display = "none";
    img.alt = "Video thumbnail";

    const hiddenVideo = document.createElement("video");
    Object.assign(hiddenVideo.style, {
      position: "absolute",
      left: "-9999px",
      width: "1px",
      height: "1px"
    });
    hiddenVideo.muted = true;
    hiddenVideo.preload = "metadata";
    hiddenVideo.src = videoUrl;
    document.body.appendChild(hiddenVideo);

    createThumbnail(hiddenVideo, function (thumbnailUrl) {
      thumbnailCache.set(videoUrl, thumbnailUrl);
      img.src = thumbnailUrl;
      img.style.display = "block";
      if (skeleton) skeleton.remove();
      document.body.removeChild(hiddenVideo);
    });

    hiddenVideo.addEventListener("error", () => {
      if (skeleton) skeleton.remove();
      const errorDiv = document.createElement("div");
      errorDiv.className = "video-error";
      errorDiv.textContent = "Failed to load thumbnail";
      item.appendChild(errorDiv);
      if (hiddenVideo.parentNode) document.body.removeChild(hiddenVideo);
    });

    item.appendChild(img);
  }
}

// Debounced scroll handler
function handleScroll(grid) {
  if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer);
  
  scrollDebounceTimer = setTimeout(() => {
    const wrapper = grid.parentElement;
    const leftBtn = wrapper.querySelector(".video-recently__left-scroll-button");
    const rightBtn = wrapper.querySelector(".video-recently__right-scroll-button");
    
    if (leftBtn && rightBtn) {
      leftBtn.classList.toggle("hidden", grid.scrollLeft === 0);
      rightBtn.classList.toggle("hidden", 
        grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 1);
    }
  }, 16);
}

showInitialSkeletons();

fetch("data/your-choices-data.json")
  .then((response) => response.json())
  .then((data) => {
    removeSkeletons();

    const videoSection = document.getElementById("videoSection");
    const sectionsFragment = document.createDocumentFragment();

    data.forEach((entry, index) => {
      const isRecently = index === 0;
      const section = document.createElement("section");
      section.className = isRecently ? "video-recently" : "video-monthly";

      const title = document.createElement("h2");
      title.className = isRecently ? "video-recently__title" : "video-monthly__title";
      title.textContent = entry.month;
      section.appendChild(title);

      const gridWrapper = isRecently ? document.createElement("div") : null;
      if (isRecently) gridWrapper.className = "video-recently__grid-wrapper";

      const grid = document.createElement("div");
      grid.className = isRecently ? "video-recently__grid" : "video-monthly__grid";

      // Batch create video items
      const itemsFragment = document.createDocumentFragment();
      entry.videos.forEach((videoUrl) => {
        const item = document.createElement("div");
        item.className = isRecently ? "video-recently__item" : "video-monthly__item";
        item.dataset.videoSrc = videoUrl;

        // Add skeleton and setup lazy loading
        const skeleton = createSkeletonLoader(
          isRecently ? "video-recently__video" : "video-monthly__video"
        );
        item.appendChild(skeleton);
        lazyLoadObserver.observe(item);

        itemsFragment.appendChild(item);
      });

      grid.appendChild(itemsFragment);

      if (isRecently) {
        gridWrapper.appendChild(grid);

        const leftBtn = document.createElement("button");
        leftBtn.className = "video-recently__left-scroll-button scroll-button";
        leftBtn.innerHTML = `
          <img class="video-recently__left-scroll-button-icon"
               src="icons/arrow_forward_ios_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" />
        `;

        const rightBtn = document.createElement("button");
        rightBtn.className = "video-recently__right-scroll-button scroll-button";
        rightBtn.innerHTML = `
          <img class="video-recently__right-scroll-button-icon"
               src="icons/arrow_forward_ios_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" />
        `;

        gridWrapper.appendChild(leftBtn);
        gridWrapper.appendChild(rightBtn);
        section.appendChild(gridWrapper);

        // Setup scroll handling
        grid.addEventListener("scroll", () => handleScroll(grid), { passive: true });
        setTimeout(() => handleScroll(grid), 0);

        // Scroll button handlers
        leftBtn.addEventListener("click", () => {
          grid.scrollBy({ left: -grid.offsetWidth, behavior: "smooth" });
        });

        rightBtn.addEventListener("click", () => {
          grid.scrollBy({ left: grid.offsetWidth, behavior: "smooth" });
        });
      } else {
        section.appendChild(grid);
      }

      sectionsFragment.appendChild(section);
    });

    videoSection.appendChild(sectionsFragment);

    // Event delegation for video controls
    videoSection.addEventListener("click", (e) => {
      const target = e.target;
      
      // Mute button
      if (target.closest(".video-recently__mute-button")) {
        const video = target.closest(".video-recently__item").querySelector(".video-recently__video");
        const shouldMute = !video.muted;
        
        document.querySelectorAll(".video-recently__video").forEach((v) => {
          v.muted = shouldMute;
        });

        document.querySelectorAll(".video-recently__mute-button-icon").forEach((icon) => {
          icon.src = shouldMute
            ? "icons/no_sound_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg"
            : "icons/volume_up_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg";
        });
      }
      
      // Full screen button
      else if (target.closest(".video-recently__full-screen-button")) {
        const video = target.closest(".video-recently__item").querySelector(".video-recently__video");
        const overlay = document.getElementById("videoOverlay");
        const overlayVideo = document.getElementById("overlayVideo");

        overlay.classList.remove("hidden");
        overlayVideo.src = video.src;
        overlayVideo.currentTime = video.currentTime;
        overlayVideo.play();
      }
      
      // Play button
      else if (target.closest(".video-recently__play-button")) {
        const video = target.closest(".video-recently__item").querySelector(".video-recently__video");
        
        document.querySelectorAll("video").forEach((v) => {
          if (v !== video) v.pause();
        });

        const icon = target.closest(".video-recently__play-button").querySelector("img");
        if (video.paused) {
          video.play();
          icon.src = "icons/pause_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg";
        } else {
          video.pause();
          icon.src = "icons/play_arrow_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg";
        }
      }
      
      // Recently video click
      else if (target.classList.contains("video-recently__video")) {
        if (window.innerWidth < 1024) {
          const overlay = document.getElementById("videoOverlay");
          const overlayVideo = document.getElementById("overlayVideo");
          overlay.classList.remove("hidden");
          overlayVideo.src = target.src;
          overlayVideo.currentTime = target.currentTime;
          overlayVideo.play();
        } else {
          document.querySelectorAll("video").forEach((v) => {
            if (v !== target) v.pause();
          });
          target.play();
        }
      }
      
      // Monthly video click
      else if (target.classList.contains("video-monthly__video")) {
        const overlay = document.getElementById("videoOverlay");
        const overlayVideo = document.getElementById("overlayVideo");
        overlay.classList.remove("hidden");
        overlayVideo.src = target.dataset.videoSrc;
        overlayVideo.currentTime = 0;
        overlayVideo.play();
      }
    });

    // Setup overlay events
    const overlay = document.getElementById("videoOverlay");
    const overlayVideo = document.getElementById("overlayVideo");
    const closeOverlay = document.getElementById("closeOverlay");

    const hideOverlay = () => {
      overlay.classList.add("hidden");
      overlayVideo.pause();
      overlayVideo.src = "";
    };

    closeOverlay.addEventListener("click", hideOverlay);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) hideOverlay();
    });
  })
  .catch((error) => {
    console.error("Error loading video data:", error);
    removeSkeletons();
    const videoSection = document.getElementById("videoSection");
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = "Failed to load video gallery. Please try again later.";
    videoSection.appendChild(errorDiv);
  });

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  lazyLoadObserver.disconnect();
  if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer);
  thumbnailCache.forEach(url => URL.revokeObjectURL(url));
  thumbnailCache.clear();
});