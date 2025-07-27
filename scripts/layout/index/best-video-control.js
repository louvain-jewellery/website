export function controlMute() {
  const videos = document.querySelectorAll(".js-video");

  document.querySelectorAll(".js-mute-button").forEach((button) => {
    button.addEventListener("click", () => {
      const isMuted = videos[0].muted;
      videos.forEach((video) => (video.muted = !isMuted));

      document.querySelectorAll(".js-mute-icon").forEach((icon) => {
        icon.src = isMuted
          ? "icons/volume_up_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg"
          : "icons/no_sound_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg";
      });
    });
  });
}

export function controlPlayer() {
  const buttons = document.querySelectorAll(".js-play-button");
  const videos = document.querySelectorAll(".js-video");

  document.querySelectorAll(".js-play-button").forEach((button, index) => {
    const video = videos[index];
    const icon = button.querySelector(".js-play-icon");
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".js-video")
        .forEach((otherVideo, otherIndex) => {
          if (otherVideo !== video) {
            otherVideo.pause();
            const otherButtons = buttons[otherIndex];
            otherButtons.querySelector(".js-play-icon").src =
              "icons/play_arrow_22dp_FFFFFF_FILL1_wght300_GRAD0_opsz24.svg";
          }
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
}
