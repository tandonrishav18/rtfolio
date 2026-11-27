const toggle = document.querySelector(".video-toggle");
const video = toggle.querySelector("video");
const playIcon = toggle.querySelector(".play-icon");
const soundToggle = document.querySelector(".sound-toggle");
let pausedByViewer = false;
let inView = false;

function syncPlayback() {
  if (inView && !document.hidden && !pausedByViewer && !video.ended) {
    video.play().catch(error => {
      if (error.name === "NotAllowedError" && !video.muted && inView && !document.hidden && !pausedByViewer) {
        video.muted = true;
        video.play().catch(updateLabel);
      }
    });
  } else {
    video.pause();
  }
}

new IntersectionObserver(([entry]) => {
  inView = entry.isIntersecting;
  syncPlayback();
}).observe(toggle);

document.addEventListener("visibilitychange", syncPlayback);
toggle.addEventListener("click", () => {
  pausedByViewer = !video.paused;
  if (pausedByViewer) video.pause();
  else video.play().catch(() => {});
});

function updateLabel() {
  playIcon.toggleAttribute("hidden", !video.paused && !video.ended);
  toggle.setAttribute("aria-label", video.paused ? "Play Co-Ride video" : "Pause Co-Ride video");
}
video.addEventListener("play", updateLabel);
video.addEventListener("pause", updateLabel);
video.addEventListener("ended", updateLabel);

soundToggle.addEventListener("click", () => {
  video.muted = !video.muted;
});
video.addEventListener("volumechange", () => {
  soundToggle.classList.toggle("is-muted", video.muted);
  soundToggle.setAttribute("aria-label", video.muted ? "Unmute video" : "Mute video");
});
