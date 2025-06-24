// Performance optimizations:
// 1. Use DocumentFragment for batch DOM operations
// 2. Implement lazy loading for videos and thumbnails
// 3. Use event delegation instead of individual listeners
// 4. Add resource cleanup and memory management
// 5. Optimize thumbnail generation with requestAnimationFrame
// 6. Add debouncing for scroll events
// 7. Use WeakMap for better memory management

class VideoGalleryOptimized {
  constructor() {
    this.videoRefs = new WeakMap();
    this.thumbnailCache = new Map();
    this.intersectionObserver = null;
    this.isLoading = false;
    this.scrollDebounceTimer = null;

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupEventDelegation();
    this.loadVideoData();
  }

  // Optimized thumbnail creation with canvas reuse
  createThumbnail(video, callback) {
    const canvas = this.getOrCreateCanvas();
    const ctx = canvas.getContext("2d");

    const captureFrame = () => {
      requestAnimationFrame(() => {
        if (video.videoWidth === 0 || video.videoHeight === 0) {
          setTimeout(captureFrame, 100);
          return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            const thumbnailUrl = URL.createObjectURL(blob);
            callback(thumbnailUrl);
          },
          "image/jpeg",
          0.8
        );
      });
    };

    const handleLoadedData = () => {
      video.currentTime = 0;
      video.removeEventListener("loadeddata", handleLoadedData);
    };

    const handleSeeked = () => {
      captureFrame();
      video.removeEventListener("seeked", handleSeeked);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("seeked", handleSeeked);
    video.load();
  }

  // Reuse canvas element to reduce memory allocation
  getOrCreateCanvas() {
    if (!this.thumbnailCanvas) {
      this.thumbnailCanvas = document.createElement("canvas");
    }
    return this.thumbnailCanvas;
  }

  // Optimized skeleton creation using DocumentFragment
  createSkeletonLoader(className) {
    const skeleton = document.createElement("div");
    skeleton.className = `${className} skeleton-loader`;
    skeleton.innerHTML = '<div class="skeleton-shimmer"></div>';
    return skeleton;
  }

  // Batch DOM operations with DocumentFragment
  showInitialSkeletons() {
    const videoSection = document.getElementById("videoSection");
    const fragment = document.createDocumentFragment();

    // Recently section skeleton
    const recentlySection = this.createSkeletonSection("video-recently", 4);
    fragment.appendChild(recentlySection);

    // Monthly section skeleton
    const monthlySection = this.createSkeletonSection("video-monthly", 6);
    fragment.appendChild(monthlySection);

    videoSection.appendChild(fragment);
  }

  createSkeletonSection(className, itemCount) {
    const section = document.createElement("section");
    section.className = `${className} skeleton-section`;

    const title = document.createElement("div");
    title.className = "skeleton-title";
    section.appendChild(title);

    const grid = document.createElement("div");
    grid.className = `${className}__grid`;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < itemCount; i++) {
      const skeletonItem = this.createSkeletonLoader(`${className}__item`);
      fragment.appendChild(skeletonItem);
    }

    grid.appendChild(fragment);
    section.appendChild(grid);
    return section;
  }

  removeSkeletons() {
    document.querySelectorAll(".skeleton-section").forEach((section) => {
      section.remove();
    });
  }

  // Setup intersection observer for lazy loading
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: "50px",
      threshold: 0.1,
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadVideoElement(entry.target);
          this.intersectionObserver.unobserve(entry.target);
        }
      });
    }, options);
  }

  // Lazy load video elements
  loadVideoElement(element) {
    const videoSrc = element.dataset.videoSrc;
    if (!videoSrc) return;

    if (element.classList.contains("video-recently__item")) {
      this.loadRecentlyVideo(element, videoSrc);
    } else if (element.classList.contains("video-monthly__item")) {
      this.loadMonthlyThumbnail(element, videoSrc);
    }
  }

  loadRecentlyVideo(item, videoSrc) {
    const skeleton = item.querySelector(".skeleton-loader");

    const video = document.createElement("video");
    video.src = videoSrc;
    video.loop = true;
    video.muted = true;
    video.className = "video-recently__video";
    video.setAttribute("preload", "metadata");
    video.style.display = "none";

    const handleLoadedData = () => {
      video.style.display = "block";
      if (skeleton) skeleton.remove();
      video.removeEventListener("loadeddata", handleLoadedData);
    };

    const handleError = () => {
      if (skeleton) skeleton.remove();
      this.showVideoError(item, "Failed to load video");
      video.removeEventListener("error", handleError);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);

    item.appendChild(video);
    item.appendChild(this.createVideoControls());
  }

  loadMonthlyThumbnail(item, videoSrc) {
    const skeleton = item.querySelector(".skeleton-loader");

    // Check cache first
    if (this.thumbnailCache.has(videoSrc)) {
      this.displayThumbnail(item, this.thumbnailCache.get(videoSrc), videoSrc);
      if (skeleton) skeleton.remove();
      return;
    }

    const img = document.createElement("img");
    img.className = "video-monthly__video";
    img.dataset.videoSrc = videoSrc;
    img.style.cursor = "pointer";
    img.style.display = "none";
    img.alt = "Video thumbnail";

    const hiddenVideo = document.createElement("video");
    Object.assign(hiddenVideo.style, {
      position: "absolute",
      left: "-9999px",
      width: "1px",
      height: "1px",
    });
    hiddenVideo.muted = true;
    hiddenVideo.preload = "metadata";
    hiddenVideo.src = videoSrc;

    document.body.appendChild(hiddenVideo);

    this.createThumbnail(hiddenVideo, (thumbnailUrl) => {
      this.thumbnailCache.set(videoSrc, thumbnailUrl);
      img.src = thumbnailUrl;
      img.style.display = "block";
      if (skeleton) skeleton.remove();
      this.cleanupHiddenVideo(hiddenVideo);
    });

    const handleError = () => {
      if (skeleton) skeleton.remove();
      this.showVideoError(item, "Failed to load thumbnail");
      this.cleanupHiddenVideo(hiddenVideo);
      hiddenVideo.removeEventListener("error", handleError);
    };

    hiddenVideo.addEventListener("error", handleError);
    item.appendChild(img);
  }

  cleanupHiddenVideo(video) {
    if (video.parentNode) {
      video.parentNode.removeChild(video);
    }
  }

  displayThumbnail(item, thumbnailUrl, videoSrc) {
    const img = document.createElement("img");
    img.className = "video-monthly__video";
    img.src = thumbnailUrl;
    img.dataset.videoSrc = videoSrc;
    img.style.cursor = "pointer";
    img.alt = "Video thumbnail";
    item.appendChild(img);
  }

  showVideoError(item, message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "video-error";
    errorDiv.textContent = message;
    item.appendChild(errorDiv);
  }

  createVideoControls() {
    const fragment = document.createDocumentFragment();

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

    fragment.appendChild(muteBtn);
    fragment.appendChild(fullBtn);
    fragment.appendChild(playBtn);

    return fragment;
  }

  // Event delegation for better performance
  setupEventDelegation() {
    const videoSection = document.getElementById("videoSection");

    videoSection.addEventListener("click", (e) => {
      this.handleDelegatedClick(e);
    });

    // Debounced scroll handler
    videoSection.addEventListener(
      "scroll",
      (e) => {
        if (e.target.classList.contains("video-recently__grid")) {
          this.handleDebouncedScroll(e.target);
        }
      },
      { passive: true }
    );

    // Setup overlay events once
    this.setupOverlayEvents();
  }

  handleDelegatedClick(e) {
    const target = e.target;
    const button = target.closest("button");

    if (button) {
      if (button.classList.contains("video-recently__mute-button")) {
        this.handleMuteClick(button);
      } else if (
        button.classList.contains("video-recently__full-screen-button")
      ) {
        this.handleFullScreenClick(button);
      } else if (button.classList.contains("video-recently__play-button")) {
        this.handlePlayClick(button);
      } else if (button.classList.contains("scroll-button")) {
        this.handleScrollClick(button);
      }
      return;
    }

    // Handle video clicks
    if (target.classList.contains("video-recently__video")) {
      this.handleRecentlyVideoClick(target);
    } else if (target.classList.contains("video-monthly__video")) {
      this.handleMonthlyVideoClick(target);
    }
  }

  handleMuteClick(button) {
    const video = button.parentElement.querySelector(".video-recently__video");
    if (!video) return;

    const shouldMute = !video.muted;

    // Update all recently videos
    document.querySelectorAll(".video-recently__video").forEach((v) => {
      v.muted = shouldMute;
    });

    // Update all mute button icons
    document
      .querySelectorAll(".video-recently__mute-button-icon")
      .forEach((icon) => {
        icon.src = shouldMute
          ? "icons/no_sound_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg"
          : "icons/volume_up_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg";
      });
  }

  handleFullScreenClick(button) {
    const video = button.parentElement.querySelector(".video-recently__video");
    if (!video) return;

    this.showOverlay(video.src, video.currentTime);
  }

  handlePlayClick(button) {
    const video = button.parentElement.querySelector(".video-recently__video");
    if (!video) return;

    // Pause all other videos
    document.querySelectorAll("video").forEach((v) => {
      if (v !== video) v.pause();
    });

    const icon = button.querySelector("img");
    if (video.paused) {
      video.play();
      icon.src = "icons/pause_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg";
    } else {
      video.pause();
      icon.src = "icons/play_arrow_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg";
    }
  }

  handleScrollClick(button) {
    const wrapper = button.parentElement;
    const grid = wrapper.querySelector(".video-recently__grid");
    const isLeft = button.classList.contains(
      "video-recently__left-scroll-button"
    );

    grid.scrollBy({
      left: isLeft ? -grid.offsetWidth : grid.offsetWidth,
      behavior: "smooth",
    });
  }

  handleRecentlyVideoClick(video) {
    if (window.innerWidth < 1024) {
      this.showOverlay(video.src, video.currentTime);
    } else {
      document.querySelectorAll("video").forEach((v) => {
        if (v !== video) v.pause();
      });
      video.play();
    }
  }

  handleMonthlyVideoClick(img) {
    this.showOverlay(img.dataset.videoSrc, 0);
  }

  // Debounced scroll handler
  handleDebouncedScroll(grid) {
    if (this.scrollDebounceTimer) {
      clearTimeout(this.scrollDebounceTimer);
    }

    this.scrollDebounceTimer = setTimeout(() => {
      this.updateScrollButtonVisibility(grid);
    }, 16); // ~60fps
  }

  updateScrollButtonVisibility(grid) {
    const wrapper = grid.parentElement;
    const leftBtn = wrapper.querySelector(
      ".video-recently__left-scroll-button"
    );
    const rightBtn = wrapper.querySelector(
      ".video-recently__right-scroll-button"
    );

    if (!leftBtn || !rightBtn) return;

    const isAtStart = grid.scrollLeft === 0;
    const isAtEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 1;

    leftBtn.classList.toggle("hidden", isAtStart);
    rightBtn.classList.toggle("hidden", isAtEnd);
  }

  showOverlay(videoSrc, currentTime) {
    const overlay = document.getElementById("videoOverlay");
    const overlayVideo = document.getElementById("overlayVideo");

    overlay.classList.remove("hidden");
    overlayVideo.src = videoSrc;
    overlayVideo.currentTime = currentTime;
    overlayVideo.play();
  }

  setupOverlayEvents() {
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
      if (e.target === overlay) {
        hideOverlay();
      }
    });
  }

  async loadVideoData() {
    if (this.isLoading) return;
    this.isLoading = true;

    this.showInitialSkeletons();

    try {
      const response = await fetch("data/your-choices-data.json");
      const data = await response.json();

      this.removeSkeletons();
      this.renderVideoSections(data);
    } catch (error) {
      console.error("Error loading video data:", error);
      this.showError();
    } finally {
      this.isLoading = false;
    }
  }

  renderVideoSections(data) {
    const videoSection = document.getElementById("videoSection");
    const fragment = document.createDocumentFragment();

    data.forEach((entry, index) => {
      const section = this.createVideoSection(entry, index === 0);
      fragment.appendChild(section);
    });

    videoSection.appendChild(fragment);
  }

  createVideoSection(entry, isRecently) {
    const section = document.createElement("section");
    section.className = isRecently ? "video-recently" : "video-monthly";

    const title = document.createElement("h2");
    title.className = isRecently
      ? "video-recently__title"
      : "video-monthly__title";
    title.textContent = entry.month;
    section.appendChild(title);

    if (isRecently) {
      const gridWrapper = this.createRecentlySection(entry.videos);
      section.appendChild(gridWrapper);
    } else {
      const grid = this.createMonthlySection(entry.videos);
      section.appendChild(grid);
    }

    return section;
  }

  createRecentlySection(videos) {
    const gridWrapper = document.createElement("div");
    gridWrapper.className = "video-recently__grid-wrapper";

    const grid = document.createElement("div");
    grid.className = "video-recently__grid";

    const fragment = document.createDocumentFragment();
    videos.forEach((videoUrl) => {
      const item = this.createVideoItem("video-recently__item", videoUrl);
      fragment.appendChild(item);
    });

    grid.appendChild(fragment);

    // Add scroll buttons
    const leftBtn = this.createScrollButton("left");
    const rightBtn = this.createScrollButton("right");

    gridWrapper.appendChild(grid);
    gridWrapper.appendChild(leftBtn);
    gridWrapper.appendChild(rightBtn);

    // Setup scroll button visibility
    setTimeout(() => {
      this.updateScrollButtonVisibility(grid);
    }, 0);

    return gridWrapper;
  }

  createMonthlySection(videos) {
    const grid = document.createElement("div");
    grid.className = "video-monthly__grid";

    const fragment = document.createDocumentFragment();
    videos.forEach((videoUrl) => {
      const item = this.createVideoItem("video-monthly__item", videoUrl);
      fragment.appendChild(item);
    });

    grid.appendChild(fragment);
    return grid;
  }

  createVideoItem(className, videoUrl) {
    const item = document.createElement("div");
    item.className = className;
    item.dataset.videoSrc = videoUrl;

    // Add skeleton loader
    const skeleton = this.createSkeletonLoader(
      className.includes("recently")
        ? "video-recently__video"
        : "video-monthly__video"
    );
    item.appendChild(skeleton);

    // Setup lazy loading
    this.intersectionObserver.observe(item);

    return item;
  }

  createScrollButton(direction) {
    const button = document.createElement("button");
    button.className = `video-recently__${direction}-scroll-button scroll-button`;
    button.innerHTML = `
      <img class="video-recently__${direction}-scroll-button-icon"
          src="icons/arrow_forward_ios_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" />
    `;
    return button;
  }

  showError() {
    this.removeSkeletons();
    const videoSection = document.getElementById("videoSection");
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent =
      "Failed to load video gallery. Please try again later.";
    videoSection.appendChild(errorDiv);
  }

  // Cleanup method for memory management
  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if (this.scrollDebounceTimer) {
      clearTimeout(this.scrollDebounceTimer);
    }

    // Clean up cached thumbnails
    this.thumbnailCache.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    this.thumbnailCache.clear();

    // Clean up canvas
    if (this.thumbnailCanvas) {
      this.thumbnailCanvas = null;
    }
  }
}

// Initialize the optimized video gallery
const videoGallery = new VideoGalleryOptimized();

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  videoGallery.destroy();
});
