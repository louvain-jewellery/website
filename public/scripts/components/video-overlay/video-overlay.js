import { videoControl } from "./overlay-video-control.js";

export function showVideoOverlay(videoUrl) {
  const videoOverlay = document.querySelector(".js-video-overlay");

  videoOverlay.classList.add("visible");
  document.body.style.overflow = "hidden";

  videoOverlay.innerHTML = `
        <div class="video-overlay__video-wrapper js-overlay-video-wrapper">
          <video
            class="video-overlay__video js-overlay-video"
            src="${videoUrl}"
            loop
            muted
            autoplay
            preload="metadata"
          ></video>
          <button
            class="video-overlay__mute-button video-button mute-button js-mute-button"
          >
            <img
              class="video-overlay__mute-button-icon video-button-icon js-mute-icon"
              src="icons/no_sound_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg"
            />
          </button>
          <button
            class="video-overlay__play-button video-button play-button js-play-button"
          >
            <img
              class="video-overlay__play-button-icon video-button-icon js-play-icon"
              src="icons/pause_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg"
            />
          </button>
        </div>
        <button class="video-overlay__close-button js-close-button">
          &#10005;
        </button>
      `;

  const video = videoOverlay.querySelector(".js-overlay-video");
  videoControl(video);
}
