import { controlMute, controlPlayer } from "./best-video-control.js";

export function renderBestSeller({ slice = true } = {}) {
  let videoGrid = document.querySelector(".js-video-grid");
  videoGrid.innerHTML = "";

  fetch("data/best-sellers.json")
    .then((response) => response.json())
    .then((data) => {
      const videosUrl = slice ? data[0].videos.slice(0, 5) : data[0].videos;

      videosUrl.forEach((videoUrl) => {
        const html = `
          <div class="video-recently__item">
            <video
              class="video-recently__video js-video"
              src="${videoUrl}"
              loop
              muted
              preload="metadata"
            ></video>
            <button class="video-recently__mute-button video-button mute-button js-mute-button">
              <img
                class="video-recently__mute-button-icon video-button-icon js-mute-icon"
                src="icons/no_sound_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg"
              />
            </button>
            <button class="video-recently__play-button video-button play-button js-play-button">
              <img
                class="video-recently__play-button-icon video-button-icon js-play-icon"
                src="icons/play_arrow_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg"
              />
            </button>
          </div>
        `;
        videoGrid.insertAdjacentHTML("beforeend", html);
      });
      controlMute();
      controlPlayer();
    });
}
