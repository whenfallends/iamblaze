/* Windows XP Desktop Environment & Window Manager */

let topZIndex = 25;

function bringWindowToFront(winEl) {
  if (!winEl) return;
  topZIndex += 1;
  winEl.style.zIndex = String(topZIndex);

  document.querySelectorAll(".xp-window").forEach((w) => w.classList.remove("active-window"));
  winEl.classList.add("active-window");

  const winId = winEl.id;
  document.querySelectorAll(".taskbar-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.target === winId);
  });
}

function openOrRestoreWindow(winId) {
  const winEl = document.getElementById(winId);
  if (!winEl) return;
  winEl.classList.remove("hidden");
  bringWindowToFront(winEl);

  // Sync mobile view if on narrow viewport
  if (window.innerWidth <= 720 && (winId === "chat-window" || winId === "contacts-window")) {
    switchMobileView(winId);
  }
}

function minimizeWindow(winId) {
  const winEl = document.getElementById(winId);
  if (!winEl) return;
  winEl.classList.add("hidden");
  document.querySelectorAll(".taskbar-item").forEach((btn) => {
    if (btn.dataset.target === winId) btn.classList.remove("active");
  });
}

function toggleMaximizeWindow(winId) {
  const winEl = document.getElementById(winId);
  if (!winEl) return;
  winEl.classList.toggle("maximized");
  bringWindowToFront(winEl);
}

function closeWindow(winId) {
  minimizeWindow(winId);
}

function switchMobileView(targetId) {
  const chatWin = document.getElementById("chat-window");
  const contactsWin = document.getElementById("contacts-window");
  const tabs = document.querySelectorAll(".mobile-tab");

  if (targetId === "chat-window") {
    chatWin.classList.remove("mobile-hidden", "hidden");
    contactsWin.classList.add("mobile-hidden");
  } else {
    contactsWin.classList.remove("mobile-hidden", "hidden");
    chatWin.classList.add("mobile-hidden");
  }

  tabs.forEach((tab) => {
    const isActive = tab.dataset.mobileTarget === targetId;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
}

function initFakeVirusPopups() {
  const popupLayer = document.getElementById("virus-popup-layer");
  const alerts = [
    {
      headline: "Suspicious file detected.",
      detail: "C:\\Games\\totally-not-a-virus.exe is being running."
    },
    {
      headline: "Error: System instability detected.",
      detail: "Your computer has detected that you are running a Windows XP emulator. This may cause instability."
    },
    {
      headline: "Virus alert: hehe.exe",
      detail: "It may be attempting to install trojans on your screen. Take action now."
    },
    {
      headline: "Unusual activity detected!",
      detail: "Your computer is sending packets to a suspicious IP address. Please check your network settings."
    }
  ];
  const activePopups = new Set();
  let stopped = false;
  let nextPopupTimer;

  function schedulePopup(delay) {
    if (stopped) return;
    nextPopupTimer = window.setTimeout(() => {
      if (activePopups.size < 2) showPopup();
      schedulePopup(randomBetween(4500, 8000));
    }, delay);
  }

  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function showPopup() {
    const alert = alerts[randomBetween(0, alerts.length - 1)];
    const popup = document.createElement("section");
    popup.className = "virus-alert-window";
    popup.setAttribute("role", "dialog");
    popup.setAttribute("aria-label", "Fake virus warning");
    popup.innerHTML = `
      <header class="virus-alert-titlebar">
        <strong>XP Security Center — FAKE ALERT</strong>
        <button type="button" class="virus-alert-close" aria-label="Close alert">×</button>
      </header>
      <div class="virus-alert-content">
        <span class="virus-alert-icon" aria-hidden="true">!</span>
        <div>
          <strong></strong>
          <p></p>
          <small>This is a fictional prank popup. No scan is running.</small>
        </div>
      </div>
      <footer class="virus-alert-actions">
        <button type="button" data-dismiss-alert>Dismiss</button>
        <button type="button" data-stop-alerts>Stop virus alerts</button>
      </footer>
    `;
    popup.querySelector(".virus-alert-content strong").textContent = alert.headline;
    popup.querySelector(".virus-alert-content p").textContent = alert.detail;
    popupLayer.appendChild(popup);

    const maxLeft = Math.max(12, window.innerWidth - popup.offsetWidth - 12);
    const maxTop = Math.max(12, window.innerHeight - popup.offsetHeight - 48);
    popup.style.left = `${randomBetween(12, maxLeft)}px`;
    popup.style.top = `${randomBetween(12, maxTop)}px`;
    activePopups.add(popup);

    function dismiss() {
      if (!activePopups.has(popup)) return;
      activePopups.delete(popup);
      popup.remove();
    }

    popup.querySelector(".virus-alert-close").addEventListener("click", dismiss);
    popup.querySelector("[data-dismiss-alert]").addEventListener("click", dismiss);
    popup.querySelector("[data-stop-alerts]").addEventListener("click", () => {
      stopped = true;
      window.clearTimeout(nextPopupTimer);
      activePopups.forEach(dismiss);
    });
    window.setTimeout(dismiss, 16000);
  }

  schedulePopup(randomBetween(1500, 3500));
}

function initRetroAds() {
  const popupLayer = document.getElementById("virus-popup-layer");
  const ads = [
    {
      title: "Pokemon 2000 Now Available for DVDS!",
      tagline: "Get the latest Pokemon movie on DVD today! Limited edition bonus content included.",
      image: "assets/ads/ringtone-mix.png",
      alt: "Pokemon 2000 DVD ad with Pikachu and other Pokemon characters."
    },
    {
      title: "Game Pack",
      tagline: "Unlock 100+ retro games! Unlimited fun for hours.",
      image: "assets/ads/smiley-pack.png",
      alt: "Game Pack ad with a smiling character and a retro game controller."
    },
    {
      title: "Need for Speed II SE",
      tagline: "8 new licensed supercars! Experience the thrill of racing.",
      image: "assets/ads/screensaver-club.png",
      alt: "Need for Speed II SE ad with a racing car."
    }
  ];
  const activeAds = new Set();
  let stopped = false;
  let nextAdTimer;

  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function scheduleAd(delay) {
    if (stopped) return;
    nextAdTimer = window.setTimeout(() => {
      if (activeAds.size < 2) showAd();
      scheduleAd(randomBetween(15000, 24000));
    }, delay);
  }

  function showAd() {
    const ad = ads[randomBetween(0, ads.length - 1)];
    const card = document.createElement("section");
    card.className = "retro-ad-window";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-label", "Fictional retro advertisement");

    const titlebar = document.createElement("header");
    titlebar.className = "retro-ad-titlebar";
    const label = document.createElement("strong");
    label.textContent = "Sponsored — Just for fun";
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "retro-ad-close";
    closeButton.setAttribute("aria-label", "Close ad");
    closeButton.textContent = "×";
    titlebar.append(label, closeButton);

    const image = document.createElement("img");
    image.className = "retro-ad-image";
    image.src = ad.image;
    image.alt = ad.alt;

    const copy = document.createElement("div");
    copy.className = "retro-ad-copy";
    const title = document.createElement("strong");
    title.textContent = ad.title;
    const tagline = document.createElement("p");
    tagline.textContent = ad.tagline;
    const disclaimer = document.createElement("small");
    disclaimer.textContent = "Buy now! $99.99. SALE!!";
    copy.append(title, tagline, disclaimer);

    const actions = document.createElement("footer");
    actions.className = "retro-ad-actions";
    const dismissButton = document.createElement("button");
    dismissButton.type = "button";
    dismissButton.textContent = "Close ad";
    const stopButton = document.createElement("button");
    stopButton.type = "button";
    stopButton.textContent = "Stop ads";
    actions.append(dismissButton, stopButton);

    card.append(titlebar, image, copy, actions);
    popupLayer.appendChild(card);

    const maxLeft = Math.max(12, window.innerWidth - card.offsetWidth - 12);
    const maxTop = Math.max(12, window.innerHeight - card.offsetHeight - 48);
    card.style.left = `${randomBetween(12, maxLeft)}px`;
    card.style.top = `${randomBetween(12, maxTop)}px`;
    activeAds.add(card);

    function dismiss() {
      if (!activeAds.has(card)) return;
      activeAds.delete(card);
      card.remove();
    }

    closeButton.addEventListener("click", dismiss);
    dismissButton.addEventListener("click", dismiss);
    stopButton.addEventListener("click", () => {
      stopped = true;
      window.clearTimeout(nextAdTimer);
      activeAds.forEach(dismiss);
    });
    window.setTimeout(dismiss, 24000);
  }

  scheduleAd(randomBetween(3500, 7000));
}

function initDraggableWindows() {
  const windows = document.querySelectorAll(".xp-window");

  windows.forEach((winEl) => {
    winEl.addEventListener("mousedown", () => bringWindowToFront(winEl));

    const handle = winEl.querySelector(".window-drag-handle");
    if (!handle) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let origLeft = 0;
    let origTop = 0;

    handle.addEventListener("mousedown", (e) => {
      if (window.innerWidth <= 720) return;
      if (e.target.closest("button") || e.target.isContentEditable) return;
      if (winEl.classList.contains("maximized")) return;

      isDragging = true;
      bringWindowToFront(winEl);
      startX = e.clientX;
      startY = e.clientY;
      origLeft = winEl.offsetLeft;
      origTop = winEl.offsetTop;
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const maxLeft = Math.max(0, window.innerWidth - 120);
      const maxTop = Math.max(0, window.innerHeight - 65);
      const nextLeft = Math.min(Math.max(-80, origLeft + dx), maxLeft);
      const nextTop = Math.min(Math.max(0, origTop + dy), maxTop);
      winEl.style.left = `${nextLeft}px`;
      winEl.style.top = `${nextTop}px`;
      winEl.style.right = "auto";
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  });
}

function initDesktopControls() {
  initFakeVirusPopups();
  initRetroAds();

  // Window control buttons
  document.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const target = btn.dataset.target;
      if (action === "minimize") minimizeWindow(target);
      if (action === "maximize") toggleMaximizeWindow(target);
      if (action === "close") closeWindow(target);
    });
  });

  // Video Player
  const videoEl = document.getElementById("video-player");
  const playlistEl = document.getElementById("video-playlist-list");
  const currentNameEl = document.getElementById("video-current-name");
  const videoPlaylist = [
    // Add entries here and place matching files in the videos/ folder:
    // { name: "My Video.mp4", url: "videos/my-video.mp4" }
    {name: "0793829", url: "videos/mkgee.mp4"},
    {name: "Sample Video 2", url: "videos/sample2.mp4"},
    {name: "draft_10", url: "videos/sample3.mp4"}
  ];
  let selectedVideoIndex = -1;

  function renderVideoPlaylist() {
    playlistEl.innerHTML = "";

    videoPlaylist.forEach((video, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `video-playlist-item ${index === selectedVideoIndex ? "active" : ""}`;
      button.textContent = video.name;
      button.title = video.name;
      button.addEventListener("click", () => loadVideo(index));
      playlistEl.appendChild(button);
    });
  }

  function loadVideo(index) {
    const video = videoPlaylist[index];
    if (!video) return;

    selectedVideoIndex = index;
    videoEl.src = video.url;
    currentNameEl.textContent = video.name;
    currentNameEl.title = video.name;
    renderVideoPlaylist();
  }

  videoEl.addEventListener("ended", () => {
    if (selectedVideoIndex + 1 < videoPlaylist.length) {
      loadVideo(selectedVideoIndex + 1);
      videoEl.play().catch(() => {});
    }
  });

  renderVideoPlaylist();
  if (videoPlaylist.length > 0) {
    loadVideo(0);
  }

  // Desktop icons
  document.querySelectorAll(".desktop-icon").forEach((iconBtn) => {
    iconBtn.addEventListener("click", () => {
      const app = iconBtn.dataset.app;
      if (app === "notepad") openOrRestoreWindow("notepad-window");
      if (app === "my-computer") openOrRestoreWindow("my-computer-window");
      if (app === "winamp") openOrRestoreWindow("winamp-window");
      if (app === "video-player") openOrRestoreWindow("video-player-window");
      if (app === "tetris") openOrRestoreWindow("tetris-window");
      if (app === "chess") openOrRestoreWindow("chess-window");
      if (app === "recycle-bin") {
        openOrRestoreWindow("my-computer-window");
      }
    });
  });

  // Taskbar window buttons
  document.querySelectorAll(".taskbar-item").forEach((tbBtn) => {
    tbBtn.addEventListener("click", () => {
      const targetId = tbBtn.dataset.target;
      const winEl = document.getElementById(targetId);
      if (!winEl) return;
      if (winEl.classList.contains("hidden")) {
        openOrRestoreWindow(targetId);
      } else if (winEl.classList.contains("active-window")) {
        minimizeWindow(targetId);
      } else {
        bringWindowToFront(winEl);
      }
    });
  });

  // Start menu toggle
  const startBtn = document.getElementById("xp-start-btn");
  const startMenu = document.getElementById("xp-start-menu");
  const startCloseBtn = document.getElementById("start-close-btn");

  startBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isHidden = startMenu.classList.toggle("hidden");
    startBtn.setAttribute("aria-expanded", String(!isHidden));
  });

  startCloseBtn.addEventListener("click", () => {
    startMenu.classList.add("hidden");
    startBtn.setAttribute("aria-expanded", "false");
  });

  document.querySelectorAll("[data-open-window]").forEach((item) => {
    item.addEventListener("click", () => {
      openOrRestoreWindow(item.dataset.openWindow);
      startMenu.classList.add("hidden");
      startBtn.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#xp-start-menu") && !e.target.closest("#xp-start-btn")) {
      startMenu.classList.add("hidden");
      startBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Mobile switcher
  document.querySelectorAll(".mobile-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      switchMobileView(tab.dataset.mobileTarget);
    });
  });

  // Winamp mini controls
  const winampWin = document.getElementById("winamp-window");
  const trackLabel = winampWin.querySelector(".winamp-track");
  const tracks = [
    { title: "1. Mk.gee - Small Hope.mp3", src: "audio/smallhope.mp3" },
    { title: "2. Malcolm Todd - Rodrick Rules", src: "audio/rodrickrules.mp3" },
    { title: "3. prettifun - Moon and Stars", src: "audio/moonandstars.mp3" },
    { title: "4. Maksim - Do You Know.mp3", src: "audio/maksim.mp3" }
  ];
  let trackIdx = 0;
  const winampAudio = new Audio(tracks[trackIdx].src);
  winampAudio.preload = "none";

  function loadWinampTrack(shouldPlay) {
    winampAudio.src = tracks[trackIdx].src;
    winampAudio.load();
    trackLabel.textContent = tracks[trackIdx].title;
    winampWin.classList.remove("paused");

    if (shouldPlay) {
      winampAudio.play().catch(() => {
        winampWin.classList.add("paused");
      });
    }
  }

  document.getElementById("wa-play").addEventListener("click", () => {
    winampWin.classList.remove("paused");
    winampAudio.play().catch(() => {
      winampWin.classList.add("paused");
    });
  });
  document.getElementById("wa-pause").addEventListener("click", () => {
    winampWin.classList.toggle("paused");
    if (winampWin.classList.contains("paused")) {
      winampAudio.pause();
    } else {
      winampAudio.play().catch(() => {
        winampWin.classList.add("paused");
      });
    }
  });
  document.getElementById("wa-stop").addEventListener("click", () => {
    winampWin.classList.add("paused");
    winampAudio.pause();
    winampAudio.currentTime = 0;
  });
  document.getElementById("wa-next").addEventListener("click", () => {
    trackIdx = (trackIdx + 1) % tracks.length;
    loadWinampTrack(true);
  });
  document.getElementById("wa-prev").addEventListener("click", () => {
    trackIdx = (trackIdx - 1 + tracks.length) % tracks.length;
    loadWinampTrack(true);
  });
  winampAudio.addEventListener("ended", () => {
    trackIdx = (trackIdx + 1) % tracks.length;
    loadWinampTrack(true);
  });

  // Live Taskbar Clock
  const clockEl = document.getElementById("xp-clock");
  function updateClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    clockEl.textContent = `${hh}:${mm}`;
  }
  updateClock();
  setInterval(updateClock, 15000);
}
