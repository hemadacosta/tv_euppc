// script.js (v8) — navegação confiável (YouTube/Vimeo/Dailymotion/Rumble) + controles discretos
// SUPORTA: YouTube, Vimeo, Dailymotion (API 2024), Rumble

let currentIndex = 0;
let ytPlayer = null;           // instância YT.Player
let vimeoPlayer = null;        // instância Vimeo.Player
let dailymotionPlayer = null;  // instância do novo Player Dailymotion
let rumblePlayer = null;       // referência ao iframe do Rumble
let currentType = null;
let currentVolume = 100;
let autoplayEnabled = true;
let manualControl = false;
let vimeoAPILoaded = false;
let dailymotionAPILoaded = false;

// ====== Controles de volume ======
const volumeSlider = document.getElementById('volume-slider');
const volumeValue  = document.getElementById('volume-value');

function setVolumeUI(vol) {
  currentVolume = Math.max(0, Math.min(100, Number(vol) || 0));
  if (volumeValue) volumeValue.textContent = `${currentVolume}%`;
  if (volumeSlider) volumeSlider.value = String(currentVolume);
}

function applyVolumeToPlayer() {
  try {
    if (currentType === 'youtube' && ytPlayer && typeof ytPlayer.setVolume === 'function') {
      ytPlayer.setVolume(currentVolume);
    } else if (currentType === 'vimeo' && vimeoPlayer && typeof vimeoPlayer.setVolume === 'function') {
      vimeoPlayer.setVolume(currentVolume / 100);
    } else if (currentType === 'dailymotion' && dailymotionPlayer && typeof dailymotionPlayer.setVolume === 'function') {
      dailymotionPlayer.setVolume(currentVolume / 100);
    }
    // Rumble não tem API de volume via JavaScript
  } catch (e) {
    console.warn("Falha ao aplicar volume:", e);
  }
}

if (volumeSlider) {
  volumeSlider.addEventListener('input', () => {
    setVolumeUI(volumeSlider.value);
    applyVolumeToPlayer();
    maybeUnmuteIfUserChangedVolume();
  }, { passive: true });
}

// ====== UI: Controles discretos ======
const navControls = document.getElementById('nav-controls');
const videoWrapper = document.getElementById('video-wrapper');

let hideTimer = null;
function showNavTemporarily(ms = 2500) {
  if (!navControls) return;
  navControls.classList.add('show');
  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => navControls.classList.remove('show'), ms);
}

if (videoWrapper) {
  videoWrapper.addEventListener('pointerdown', () => showNavTemporarily(2500), { passive: true });
  videoWrapper.addEventListener('focusin', () => showNavTemporarily(4000));
}

let autoplayMuted = true;

function enforceMutedAutoplay() {
  try {
    if (currentType === 'youtube' && ytPlayer && typeof ytPlayer.mute === 'function' && autoplayMuted) {
      ytPlayer.mute();
    }
  } catch (_) {}
}

function maybeUnmuteIfUserChangedVolume() {
  try {
    if (currentVolume > 0) {
      if (ytPlayer && typeof ytPlayer.unMute === 'function') ytPlayer.unMute();
      if (vimeoPlayer && typeof vimeoPlayer.setMuted === 'function') vimeoPlayer.setMuted(false);
      if (dailymotionPlayer && typeof dailymotionPlayer.setMuted === 'function') dailymotionPlayer.setMuted(false);
    }
  } catch (_) {}
}

// ====== Programação ======
function safeSchedule() {
  if (typeof schedule === 'undefined' || !Array.isArray(schedule) || schedule.length === 0) return [];
  return schedule;
}

function updateInfo(title, status) {
  const t = document.getElementById('video-title');
  const s = document.getElementById('status-text');
  if (t) t.innerText = title || '';
  if (s) s.innerText = status || '';
}

// ====== Navegação ======
let _advanceLock = false;

function playNextManual() {
  manualControl = true;
  playNext(false);
}

function playNext(fromAuto = false) {
  if (_advanceLock) return;
  if (fromAuto) _advanceLock = true;

  const sch = safeSchedule();
  if (sch.length === 0) {
    updateInfo("Nenhum vídeo na programação.", "Verifique o config.js.");
    _advanceLock = false;
    return;
  }
  currentIndex = (currentIndex + 1) % sch.length;
  loadVideo(currentIndex, !fromAuto);

  if (fromAuto) setTimeout(() => { _advanceLock = false; }, 1200);
}

function playPrevious() {
  const sch = safeSchedule();
  if (sch.length === 0) {
    updateInfo("Nenhum vídeo na programação.", "Verifique o config.js.");
    return;
  }
  currentIndex = (currentIndex - 1 + sch.length) % sch.length;
  loadVideo(currentIndex, true);
}

window.playNextManual = playNextManual;
window.playNext = playNext;
window.playPrevious = playPrevious;

let _lastNavClickAt = 0;
function _navGuard() {
  const now = Date.now();
  if (now - _lastNavClickAt < 350) return false;
  _lastNavClickAt = now;
  return true;
}

const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
function bindNavButton(btn, fn) {
  if (!btn) return;
  const handler = (ev) => {
    if (!_navGuard()) return;
    ev.preventDefault();
    ev.stopPropagation();
    fn();
    showNavTemporarily(2000);
  };
  btn.addEventListener('pointerdown', handler, { capture: true });
  btn.addEventListener('click', handler, { capture: true });
}
bindNavButton(btnPrev, playPrevious);
bindNavButton(btnNext, playNextManual);

// ====== Carregamento do vídeo ======
function loadVideo(index, fromUser = false) {
  const sch = safeSchedule();
  if (sch.length === 0) {
    updateInfo("Nenhum vídeo na programação.", "Aguarde, iniciando o fluxo...");
    return;
  }

  const videoData = sch[index];
  if (!videoData || !videoData.url) {
    updateInfo("Vídeo inválido na programação.", `Item ${index + 1} sem URL.`);
    return;
  }

  manualControl = !!fromUser;
  updateInfo(videoData.title || "Vídeo", `Vídeo ${index + 1} de ${sch.length}`);

  // Detecta tipo automaticamente
  let type = videoData.type;
  if (!type) {
    const u = String(videoData.url).toLowerCase();
    if (u.includes('youtube.com') || u.includes('youtu.be')) type = 'youtube';
    else if (u.includes('vimeo.com')) type = 'vimeo';
    else if (u.includes('dailymotion.com') || u.includes('dai.ly')) type = 'dailymotion';
    else if (u.includes('rumble.com')) type = 'rumble';
    else if (u.includes('drive.google.com')) type = 'googledrive';
  }
  currentType = type;

  if (videoData.embedHtml) {
    const container = document.getElementById('player');
    if (container) container.innerHTML = videoData.embedHtml;
    return;
  }

  // Carrega conforme tipo
  switch(type) {
    case 'youtube':
      loadYouTube(videoData.url, autoplayEnabled);
      break;
    case 'vimeo':
      loadVimeo(videoData.url, autoplayEnabled);
      break;
    case 'dailymotion':
      loadDailymotion(videoData.url, autoplayEnabled);
      break;
    case 'rumble':
      loadRumble(videoData.url, autoplayEnabled);
      break;
    case 'googledrive':
      loadGoogleDrive(videoData.url);
      break;
    default:
      console.error("Tipo não suportado:", type, videoData);
      updateInfo(videoData.title || "Vídeo", "Tipo de vídeo não suportado.");
  }
}

// ====== LIMPEZA DE PLAYERS ======
function clearPlayerContainer() {
  const container = document.getElementById('player');
  if (!container) return;

  // Destroi YouTube
  if (ytPlayer) {
    try { ytPlayer.destroy(); } catch (e) { console.warn("Erro ao destruir YouTube:", e); }
    ytPlayer = null;
  }

  // Destroi Vimeo
  if (vimeoPlayer) {
    try { vimeoPlayer.destroy(); } catch (e) { console.warn("Erro ao destruir Vimeo:", e); }
    vimeoPlayer = null;
  }

  // Destroi Dailymotion (novo método)
  if (dailymotionPlayer) {
    try { 
      if (typeof dailymotionPlayer.destroy === 'function') {
        dailymotionPlayer.destroy(); 
      }
    } catch (e) { console.warn("Erro ao destruir Dailymotion:", e); }
    dailymotionPlayer = null;
  }

  // Limpa Rumble
  rumblePlayer = null;

  // Limpa HTML
  container.innerHTML = '';
}

// ====== YOUTUBE ======
function extractYouTubeID(url) {
  if (!url) return null;
  const u = String(url).trim();
  try {
    const parsed = new URL(u, window.location.href);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      if (id) return id;
    }
    const v = parsed.searchParams.get('v');
    if (v) return v;
    const parts = parsed.pathname.split('/').filter(Boolean);
    const embedIdx = parts.indexOf('embed');
    if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
    const shortsIdx = parts.indexOf('shorts');
    if (shortsIdx >= 0 && parts[shortsIdx + 1]) return parts[shortsIdx + 1];
  } catch (_) {}

  const m = u.match(/youtu\.be\/([^\/\?\&]+)/) ||
            u.match(/[?&]v=([^\/\?\&]+)/) ||
            u.match(/youtube\.com\/embed\/([^\/\?\&]+)/) ||
            u.match(/youtube\.com\/shorts\/([^\/\?\&]+)/);
  return m ? m[1] : null;
}

function ensureYouTubeAPIReady(cb) {
  if (typeof YT !== 'undefined' && YT.Player) return cb();
  setTimeout(() => ensureYouTubeAPIReady(cb), 300);
}

function loadYouTube(url, allowAutoplay) {
  const videoId = extractYouTubeID(url);
  if (!videoId) {
    console.error("ID YouTube não encontrado:", url);
    updateInfo("Erro no YouTube", "Não encontrei o ID do vídeo.");
    return;
  }

  ensureYouTubeAPIReady(() => {
    if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
      try {
        ytPlayer.loadVideoById(videoId);
        applyVolumeToPlayer();
        maybeUnmuteIfUserChangedVolume();
        if (!allowAutoplay && typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();
        return;
      } catch (e) {
        console.warn("Falha no loadVideoById; recriando player...", e);
        clearPlayerContainer();
      }
    }

    if (vimeoPlayer || dailymotionPlayer) clearPlayerContainer();

    ytPlayer = new YT.Player('player', {
      height: '100%',
      width: '100%',
      videoId,
      playerVars: {
        autoplay: allowAutoplay ? 1 : 0,
        controls: 1,
        rel: 0,
        modestbranding: 1,
        playsinline: 1
      },
      events: {
        onReady: (ev) => {
          try { ev.target.setVolume(currentVolume); } catch (_) {}
          enforceMutedAutoplay();
          if (allowAutoplay) {
            try { ev.target.playVideo(); } catch (_) {}
          }
        },
        onStateChange: (ev) => {
          if (ev.data === YT.PlayerState.ENDED) {
            setTimeout(() => {
              manualControl = false;
              playNext(true);
            }, 800);
          }
        }
      }
    });
  });
}

// ====== VIMEO ======
function loadVimeoAPI(callback) {
  if (typeof Vimeo !== 'undefined' && Vimeo.Player) {
    vimeoAPILoaded = true;
    callback();
    return;
  }

  if (document.querySelector('script[src*="player.vimeo.com/api/player.js"]')) {
    const checkInterval = setInterval(() => {
      if (typeof Vimeo !== 'undefined' && Vimeo.Player) {
        vimeoAPILoaded = true;
        clearInterval(checkInterval);
        callback();
      }
    }, 100);
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://player.vimeo.com/api/player.js';
  script.async = true;
  script.onload = () => {
    vimeoAPILoaded = true;
    callback();
  };
  script.onerror = () => {
    updateInfo("Erro", "Não foi possível carregar o player do Vimeo.");
  };
  document.head.appendChild(script);
}

function extractVimeoID(url) {
  if (!url) return null;
  const u = String(url).trim();
  const patterns = [
    /vimeo\.com\/(?:video\/)?(\d+)(?:[?\/]|$)/,
    /vimeo\.com\/channels\/[^\/]+\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/
  ];

  for (const pattern of patterns) {
    const m = u.match(pattern);
    if (m) return m[1];
  }
  return null;
}

function loadVimeo(url, allowAutoplay) {
  const videoId = extractVimeoID(url);
  if (!videoId) {
    console.error("ID Vimeo não encontrado:", url);
    updateInfo("Erro no Vimeo", "Não encontrei o ID do vídeo.");
    return;
  }

  loadVimeoAPI(() => {
    clearPlayerContainer();

    const container = document.getElementById('player');
    const vimeoDiv = document.createElement('div');
    vimeoDiv.id = 'vimeo-player';
    container.appendChild(vimeoDiv);

    vimeoPlayer = new Vimeo.Player('vimeo-player', {
      id: Number(videoId),
      autoplay: !!allowAutoplay,
      muted: autoplayMuted,
      title: false,
      byline: false,
      portrait: false,
      controls: true
    });

    vimeoPlayer.ready().then(() => {
      applyVolumeToPlayer();
      maybeUnmuteIfUserChangedVolume();
      if (allowAutoplay) {
        vimeoPlayer.play().catch((err) => {
          console.warn("Autoplay bloqueado:", err);
        });
      }
    });

    vimeoPlayer.on('ended', () => {
      setTimeout(() => {
        manualControl = false;
        playNext(true);
      }, 800);
    });

    vimeoPlayer.on('error', (err) => {
      console.error("Erro no Vimeo:", err);
      updateInfo("Erro no Vimeo", "Não foi possível reproduzir o vídeo");
    });
  });
}

// ====== DAILYMOTION (API 2024 - geo.dailymotion.com) ======
function loadDailymotionAPI(callback) {
  if (typeof dailymotion !== 'undefined' && dailymotion.createPlayer) {
    dailymotionAPILoaded = true;
    callback();
    return;
  }

  if (document.querySelector('script[src*="geo.dailymotion.com/libs/player.js"]')) {
    const checkInterval = setInterval(() => {
      if (typeof dailymotion !== 'undefined' && dailymotion.createPlayer) {
        dailymotionAPILoaded = true;
        clearInterval(checkInterval);
        callback();
      }
    }, 100);
    return;
  }

  console.log("Carregando nova API do Dailymotion...");

  const script = document.createElement('script');
  script.src = 'https://geo.dailymotion.com/libs/player.js';
  script.async = true;
  script.onload = () => {
    console.log("API do Dailymotion carregada!");
    dailymotionAPILoaded = true;
    callback();
  };
  script.onerror = () => {
    console.error("Falha ao carregar API do Dailymotion");
    updateInfo("Erro", "Não foi possível carregar o player do Dailymotion.");
  };
  document.head.appendChild(script);
}

function extractDailymotionID(url) {
  if (!url) return null;
  const u = String(url).trim();

  // Formatos suportados:
  // https://www.dailymotion.com/video/x8u8f44
  // https://dai.ly/x8u8f44
  // https://geo.dailymotion.com/player.html?video=x8u8f44

  const patterns = [
    /dailymotion\.com\/video\/([a-zA-Z0-9]+)/,
    /dai\.ly\/([a-zA-Z0-9]+)/,
    /geo\.dailymotion\.com\/player\.html\?video=([a-zA-Z0-9]+)/
  ];

  for (const pattern of patterns) {
    const m = u.match(pattern);
    if (m) return m[1];
  }

  return null;
}

function loadDailymotion(url, allowAutoplay) {
  const videoId = extractDailymotionID(url);
  if (!videoId) {
    console.error("ID Dailymotion não encontrado:", url);
    updateInfo("Erro no Dailymotion", "Não encontrei o ID do vídeo. Verifique a URL.");
    return;
  }

  console.log("Carregando vídeo Dailymotion:", videoId);

  loadDailymotionAPI(() => {
    clearPlayerContainer();

    const container = document.getElementById('player');
    const dmDiv = document.createElement('div');
    dmDiv.id = 'dailymotion-player';
    container.appendChild(dmDiv);

    // Cria player usando a nova API
    dailymotion
      .createPlayer('dailymotion-player', {
        video: videoId,
        params: {
          mute: autoplayMuted,
          // Autoplay é controlado pelo parametro startTime
          startTime: 0
        }
      })
      .then((player) => {
        console.log("Player Dailymotion criado!");
        dailymotionPlayer = player;

        // Aplica volume
        applyVolumeToPlayer();
        maybeUnmuteIfUserChangedVolume();

        // Se não permitir autoplay, pausa imediatamente
        if (!allowAutoplay) {
          player.pause();
        }

        // Evento: vídeo terminou
        player.on(dailymotion.events.VIDEO_END, () => {
          console.log("Dailymotion: vídeo terminou");
          setTimeout(() => {
            manualControl = false;
            playNext(true);
          }, 800);
        });

        // Evento: erro
        player.on(dailymotion.events.PLAYER_ERROR, (error) => {
          console.error("Erro no Dailymotion:", error);
          updateInfo("Erro no Dailymotion", "Não foi possível reproduzir o vídeo");
        });

        // Evento: pronto para reproduzir
        player.on(dailymotion.events.VIDEO_PLAY, () => {
          console.log("Dailymotion: reproduzindo");
        });
      })
      .catch((error) => {
        console.error("Falha ao criar player Dailymotion:", error);
        updateInfo("Erro no Dailymotion", "Falha ao inicializar player");
      });
  });
}

// ====== RUMBLE ======
function extractRumbleID(url) {
  if (!url) return null;
  const u = String(url).trim();
  // Formatos: rumble.com/v123abc-nome-do-video.html
  const m = u.match(/rumble\.com\/(v[a-zA-Z0-9]+)/);
  return m ? m[1] : null;
}

function loadRumble(url, allowAutoplay) {
  const videoId = extractRumbleID(url);
  if (!videoId) {
    console.error("ID Rumble não encontrado:", url);
    updateInfo("Erro no Rumble", "Não encontrei o ID do vídeo.");
    return;
  }

  clearPlayerContainer();

  const container = document.getElementById('player');

  // Rumble usa iframe embed
  // Autoplay: adiciona ?autoplay=2 (2 = autoplay com som, 1 = muted)
  const autoplayParam = allowAutoplay ? '?autoplay=2' : '';
  const embedUrl = `https://rumble.com/embed/${videoId}/${autoplayParam}`;

  container.innerHTML = `
    <iframe 
      id="rumble-player"
      src="${embedUrl}" 
      width="100%" 
      height="100%"
      frameborder="0" 
      allowfullscreen
      allow="autoplay; encrypted-media"
      style="border: none; width: 100%; height: 100%;"
    ></iframe>
  `;

  rumblePlayer = document.getElementById('rumble-player');

  // Rumble não tem API JavaScript oficial para detectar "ended"
  updateInfo(
    document.getElementById('video-title')?.innerText || "Vídeo",
    "Rumble: reproduzindo (use os botões para navegar)"
  );
}

// ====== GOOGLE DRIVE ======
function extractDriveFileId(url) {
  if (!url) return null;
  const u = String(url);
  const m1 = u.match(/\/file\/d\/([^\/]+)\//);
  if (m1) return m1[1];
  try {
    const parsed = new URL(u, window.location.href);
    const id = parsed.searchParams.get('id');
    if (id) return id;
  } catch (_) {}
  return null;
}

function loadGoogleDrive(url) {
  const fileId = extractDriveFileId(url);
  if (!fileId) {
    console.error("ID Drive não encontrado:", url);
    updateInfo("Erro no Drive", "Não encontrei o ID do arquivo.");
    return;
  }

  clearPlayerContainer();
  const container = document.getElementById('player');
  const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  container.innerHTML = `
    <video id="drive-video" width="100%" height="100%" playsinline
      ${autoplayEnabled ? "autoplay" : ""} muted controls
      style="background:#000; width:100%; height:100%; object-fit:contain;"
    >
      <source src="${directUrl}" type="video/mp4">
      Seu navegador não suporta vídeo HTML5.
    </video>
  `;

  const vid = document.getElementById('drive-video');
  if (!vid) return;

  try { vid.volume = Math.max(0, Math.min(1, currentVolume / 100)); } catch(_) {}
  vid.muted = true;

  vid.addEventListener('ended', () => {
    setTimeout(() => {
      manualControl = false;
      playNext(true);
    }, 800);
  });

  vid.addEventListener('error', () => {
    container.innerHTML = `
      <iframe
        src="https://drive.google.com/file/d/${fileId}/preview"
        width="100%" height="100%"
        allow="autoplay"
        allowfullscreen
        style="border:0;"
      ></iframe>
    `;
    updateInfo(
      document.getElementById('video-title')?.innerText || "Vídeo",
      "Drive: este vídeo pode exigir clique no play (limitação do Drive)."
    );
  });

  updateInfo(
    document.getElementById('video-title')?.innerText || "Vídeo",
    autoplayEnabled
      ? "Drive: iniciando (silencioso). Ajuste o volume para ativar som."
      : "Drive: pronto. Clique em play para iniciar."
  );
}

// ====== Inicialização ======
(function init() {
  setVolumeUI(currentVolume);

  const sch = safeSchedule();
  if (sch.length === 0) {
    updateInfo("Nenhum vídeo na programação.", "Aguarde, iniciando o fluxo...");
    return;
  }
  manualControl = false;
  loadVideo(0, false);
})();
