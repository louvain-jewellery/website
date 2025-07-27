export function videoControl(video) {
  const container = video.closest(".js-video-overlay");

  const muteButton = container.querySelector(".js-mute-button");
  const muteIcon = muteButton.querySelector(".js-mute-icon");

  const playButton = container.querySelector(".js-play-button");
  const playIcon = playButton.querySelector(".js-play-icon");

  function togglePlay() {
    video.classList.toggle("is-played");
    if (video.classList.contains("is-played")) {
      video.pause();
      playIcon.src =
        "icons/play_arrow_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg";
    } else {
      video.play();
      playIcon.src = "icons/pause_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg";
    }
  }

  function toggleMute() {
    video.classList.toggle("is-muted");
    if (video.classList.contains("is-muted")) {
      video.muted = false;
      muteIcon.src =
        "icons/volume_up_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg";
    } else {
      video.muted = true;
      muteIcon.src =
        "icons/no_sound_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg";
    }
  }

  video.addEventListener("click", togglePlay);
  muteButton.addEventListener("click", toggleMute);
  playButton.addEventListener("click", togglePlay);
}
