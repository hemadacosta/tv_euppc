// script.js (v5) — navegação confiável (YouTube/Vimeo) + controles discretos
let currentIndex = 0;
let player = null;
let autoAdvanceTimer = null;

const videoElement = document.getElementById("videoPlayer");
const titleElement = document.getElementById("videoTitle");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function clearPlayer() {
  if (player && typeof player.destroy === "function") {
    player.destroy();
  }
  player = null;
  videoElement.innerHTML = "";
}

function loadVideo(index, fromUser = false) {
  clearTimeout(autoAdvanceTimer);
  clearPlayer();

  const video = playlist[index];
  currentIndex = index;

  titleElement.textContent = video.title || "";

  if (video.type === "youtube") {
    loadYouTube(video.id);
  } else if (video.type === "vimeo") {
    loadVimeo(video.id);
  }

  if (!fromUser) {
    scheduleNext();
  }
}

function loadYouTube(videoId) {
  const iframe = document.createElement("iframe");

  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`;
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;

  videoElement.appendChild(iframe);
}

function loadVimeo(videoId) {
  const iframe = document.createElement("iframe");

  iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1`;
  iframe.allow = "autoplay; fullscreen; picture-in-picture";
  iframe.allowFullscreen = true;

  videoElement.appendChild(iframe);
}

function scheduleNext() {
  autoAdvanceTimer = setTimeout(() => {
    nextVideo();
  }, playlist[currentIndex].duration || 300000);
}

function nextVideo() {
  const nextIndex = (currentIndex + 1) % playlist.length;
  loadVideo(nextIndex);
}

function prevVideo() {
  const prevIndex =
    (currentIndex - 1 + playlist.length) % playlist.length;
  loadVideo(prevIndex, true);
}

prevBtn.addEventListener("click", () => {
  prevVideo();
});

nextBtn.addEventListener("click", () => {
  const nextIndex = (currentIndex + 1) % playlist.length;
  loadVideo(nextIndex, true);
});

loadVideo(0);
