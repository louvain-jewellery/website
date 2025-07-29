import { showVideoOverlay } from "../../components/video-overlay/video-overlay.js";
import { hideOverlay } from "../../components/hide-overlay.js";

export function renderVideos(items, catalogueWrapper, showItemCount) {
  const allItems = items[0].videos.slice(0, 10);
  showItemCount.textContent = "10 Items";
  const videoOverlay = document.querySelector(".js-video-overlay");

  videoOverlay.addEventListener("click", (e) => {
    const videoWrapper = videoOverlay.querySelector(
      ".js-overlay-video-wrapper"
    );
    hideOverlay(e, videoOverlay, videoWrapper);
  });

  allItems.forEach((videoSrc) => {
    const html = `
      <div class="video-section__item js-video-wrapper" data-video-url="${videoSrc}">
        <video
          class="video-section__video js-video"
          src="${videoSrc}"
          loop
          muted
          preload="metadata"
        ></video>
        <button
          class="video-section__play-button video-button play-button"
        >
          <img
            class="video-section__play-button-icon video-button-icon js-play-icon"
            src="icons/play_arrow_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg"
          />
        </button>
      </div>
    `;

    catalogueWrapper.insertAdjacentHTML("beforeend", html);
  });

  catalogueWrapper.querySelectorAll(".js-video-wrapper").forEach((wrapper) => {
    wrapper.addEventListener("click", () => {
      const videoUrl = wrapper.dataset.videoUrl;
      showVideoOverlay(videoUrl);
    });
  });
}
