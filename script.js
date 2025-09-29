// script.js — Autoplay (muted) on load + fade-in; no Settings click needed

/* ================== I18N STRINGS ================== */
const STRINGS = {
  en: {
    play: "Play",
    learn: "Learn",
    sandbox: "Sandbox",
    settings: "Settings",
    fontSize: "Font size",
    fontSizeHint: "Adjust overall text size.",
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeCB: "Color-blind",
    themeHint: "High-contrast palette for color-blind accessibility.",
    language: "Language",
    music: "Music",
    musicPlay: "Play",
    musicPause: "Pause",
    volume: "Volume",
    volumeHint: "Use the button to play/pause. Volume saves automatically.",
    sfx: "Sound effects",
    sfxHint: "Controls button click sound volume.",
    tapEnableAudio: "Tap anywhere to enable music"
  },
  fr: {
    play: "Jouer",
    learn: "Apprendre",
    sandbox: "Bac à sable",
    settings: "Paramètres",
    fontSize: "Taille de la police",
    fontSizeHint: "Ajustez la taille générale du texte.",
    theme: "Thème",
    themeLight: "Clair",
    themeDark: "Sombre",
    themeCB: "Daltonien",
    themeHint: "Palette à contraste élevé pour l’accessibilité.",
    language: "Langue",
    music: "Musique",
    musicPlay: "Lire",
    musicPause: "Pause",
    volume: "Volumen",
    volumeHint: "Utilisez le bouton pour lire/mettre en pause. Le volume est sauvegardé.",
    sfx: "Effets sonores",
    sfxHint: "Contrôle le volume du clic.",
    tapEnableAudio: "Touchez n’importe où pour activer la musique"
  },
  es: {
    play: "Jugar",
    learn: "Aprender",
    sandbox: "Sandbox",
    settings: "Ajustes",
    fontSize: "Tamaño de fuente",
    fontSizeHint: "Ajusta el tamaño general del texto.",
    theme: "Tema",
    themeLight: "Claro",
    themeDark: "Oscuro",
    themeCB: "Daltonismo",
    themeHint: "Paleta de alto contraste para accesibilidad.",
    language: "Idioma",
    music: "Música",
    musicPlay: "Reproducir",
    musicPause: "Pausar",
    volume: "Volumen",
    volumeHint: "Usa el botón para reproducir/pausar. El volumen se guarda.",
    sfx: "Efectos de sonido",
    sfxHint: "Controla el volumen del clic.",
    tapEnableAudio: "Toca en cualquier lugar para activar la música"
  },
  ar: {
    play: "ابدأ",
    learn: "تعلّم",
    sandbox: "مختبر حر",
    settings: "الإعدادات",
    fontSize: "حجم الخط",
    fontSizeHint: "اضبط حجم النص العام.",
    theme: "السمة",
    themeLight: "فاتح",
    themeDark: "داكن",
    themeCB: "عالي التباين",
    themeHint: "لوحة ألوان عالية التباين لسهولة القراءة.",
    language: "اللغة",
    music: "الموسيقى",
    musicPlay: "تشغيل",
    musicPause: "إيقاف مؤقت",
    volume: "مستوى الصوت",
    volumeHint: "استخدم الزر للتشغيل/الإيقاف المؤقت. يتم حفظ الصوت.",
    sfx: "المؤثرات الصوتية",
    sfxHint: "يضبط مستوى صوت نقرة الأزرار.",
    tapEnableAudio: "اضغط في أي مكان لتفعيل الموسيقى"
  }
};

/* ================== ASSET LISTS ================== */
const FLOWER_IMAGES = ["assets/Flower1.png", "assets/Flower2.png"];
const GATE_IMAGES = ["assets/AndGate.png", "assets/NotGate.png", "assets/OrGate.png"];
const BIT_IMAGES = { "0": "assets/0.png", "1": "assets/1.png" };

/* ================== DOM HOOKS ================== */
const modal = document.getElementById("settings-modal");
const openBtn = document.getElementById("open-settings");
const closeBackdrop = document.getElementById("close-settings");
const xClose = document.getElementById("x-close");

const fontSize = document.getElementById("font-size");
const themeRadios = document.querySelectorAll('input[name="theme"]');
const languageSelect = document.getElementById("language");

const music = document.getElementById("bg-music");
const toggleMusicBtn = document.getElementById("toggle-music");
const volumeSlider = document.getElementById("volume");

const sfx = document.getElementById("sfx-click");
const sfxSlider = document.getElementById("sfx-volume");

const textNodes = document.querySelectorAll("[data-i18n]");
const btnPlay = document.getElementById("btn-play");
const btnLearn = document.getElementById("btn-learn");
const btnSandbox = document.getElementById("btn-sandbox");

const floatLayer = document.querySelector(".float-layer");
const autoplayHint = document.getElementById("autoplay-hint");

/* ================== SETTINGS ================== */
const SETTINGS_KEY = "logiclab.settings";
function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function saveSettings(s) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}
function updateSettings(patch) {
  const s = { ...(loadSettings() || {}), ...patch };
  saveSettings(s);
}

/* ================== UI APPLY ================== */
function applyFontScale(scale = 100) {
  const factor = scale / 100;
  document.documentElement.style.setProperty("--font-scale", String(factor));
}
function applyTheme(theme = "light") {
  document.documentElement.setAttribute("data-theme", theme);
}
function applyLanguage(lang = "en") {
  const pack = STRINGS[lang] || STRINGS.en;
  textNodes.forEach(node => {
    const key = node.getAttribute("data-i18n");
    if (pack[key]) node.textContent = pack[key];
  });
  document.title = "Logic Lab";
  if (btnPlay) btnPlay.textContent = pack.play;
  if (btnLearn) btnLearn.textContent = pack.learn;
  if (btnSandbox) btnSandbox.textContent = pack.sandbox;

  if (toggleMusicBtn) {
    toggleMusicBtn.textContent =
      toggleMusicBtn.getAttribute("aria-pressed") === "true"
        ? pack.musicPause
        : pack.musicPlay;
  }

  if (lang === "ar") {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.lang = "ar";
  } else {
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.lang = lang;
  }

  if (autoplayHint) autoplayHint.textContent = pack.tapEnableAudio;
}
function t(key) {
  const lang = languageSelect?.value || "en";
  return (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key] || key;
}

/* ================== MUSIC HELPERS ================== */
function setPlayingUI(isPlaying) {
  if (!toggleMusicBtn) return;
  toggleMusicBtn.setAttribute("aria-pressed", isPlaying ? "true" : "false");
  toggleMusicBtn.textContent = isPlaying ? t("musicPause") : t("musicPlay");
}
function showAutoplayHint() { if (autoplayHint) autoplayHint.hidden = false; }
function hideAutoplayHint() { if (autoplayHint) autoplayHint.hidden = true; }

/* Manual toggle handler (used by the Settings button). */
toggleMusicBtn?.addEventListener("click", () => {
  const isOn = toggleMusicBtn.getAttribute("aria-pressed") === "true";
  if (isOn) {
    music.pause();
    setPlayingUI(false);
    hideAutoplayHint();
    updateSettings({ playing: false });
  } else {
    music.play().then(() => {
      // On manual user gesture, unmute and go straight to saved volume
      const s = loadSettings();
      const v = typeof s.volume === "number" ? s.volume : 0.5;
      music.muted = false;
      music.volume = v;
      setPlayingUI(true);
      hideAutoplayHint();
      updateSettings({ playing: true });
    }).catch(() => {
      // If it still fails (rare), prompt user
      showAutoplayHint();
    });
  }
});

function applySfxVolume(v = 0.7) {
  sfx.volume = v;
  if (sfxSlider) sfxSlider.value = String(v);
}

/* ================== INIT (NO initial applyMusic — autoplay block handles it) ================== */
(function init() {
  applyLanguage("en");

  const s = loadSettings();
  applyFontScale(s.fontScale ?? 100);
  applyTheme(s.theme ?? "light");
  applyLanguage(s.language ?? "en");

  // Reflect control states
  if (fontSize) fontSize.value = s.fontScale ?? 100;
  if (languageSelect) languageSelect.value = s.language ?? "en";
  [...themeRadios].forEach(r => (r.checked = r.value === (s.theme ?? "light")));
  if (volumeSlider) volumeSlider.value = String(s.volume ?? 0.5);

  applySfxVolume(s.sfxVolume ?? 0.7);

  // Floating decorations
  spawnFloaters(28);
})();

/* ================== SETTINGS EVENTS ================== */
fontSize?.addEventListener("input", (e) => {
  const val = Number(e.target.value);
  applyFontScale(val);
  updateSettings({ fontScale: val });
});
themeRadios.forEach(r =>
  r.addEventListener("change", (e) => {
    const theme = e.target.value;
    applyTheme(theme);
    updateSettings({ theme });
  })
);
languageSelect?.addEventListener("change", (e) => {
  const language = e.target.value;
  applyLanguage(language);
  updateSettings({ language });
});
volumeSlider?.addEventListener("input", (e) => {
  const v = Number(e.target.value);
  music.volume = v;
  updateSettings({ volume: v });
});

/* ================== MODAL ================== */
function openModal() { modal.setAttribute("aria-hidden", "false"); fontSize?.focus(); }
function closeModal() { modal.setAttribute("aria-hidden", "true"); }
openBtn?.addEventListener("click", openModal);
closeBackdrop?.addEventListener("click", closeModal);
xClose?.addEventListener("click", closeModal);

/* ================== FLOATERS ================== */
function spawnFloaters(count = 24) {
  const types = ["flower", "gate", "bit"];
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const el = document.createElement("div");
    el.className = "floater";

    const x = Math.random() * 100;
    const y = Math.random() * 100;

    const xDelta = (Math.random() * 120 + 40) * (Math.random() < 0.5 ? -1 : 1);
    const yDelta = (Math.random() * 120 + 40) * (Math.random() < 0.5 ? -1 : 1);

    const rotStart = Math.floor(Math.random() * 360);
    const rotDelta = (Math.random() * 180 + 90) * (Math.random() < 0.5 ? -1 : 1);

    const scale = (Math.random() * 0.8 + 0.6).toFixed(2);

    const dur = (Math.random() * 30 + 25).toFixed(2) + "s";
    const delay = (-Math.random() * 30).toFixed(2) + "s";

    el.style.left = x + "vw";
    el.style.top  = y + "vh";
    el.style.transform = `translate(-50%, -50%) scale(${scale})`;
    el.style.setProperty("--xStart", "-50%");
    el.style.setProperty("--yStart", "-50%");
    el.style.setProperty("--xDelta", xDelta + "px");
    el.style.setProperty("--yDelta", yDelta + "px");
    el.style.setProperty("--rotStart", rotStart + "deg");
    el.style.setProperty("--rotDelta", rotDelta + "deg");
    el.style.animation = `drift ${dur} ${delay} infinite ease-in-out`;

    const img = document.createElement("img");
    if (type === "flower") {
      img.src = pick(FLOWER_IMAGES);
      img.alt = "Flower";
    } else if (type === "gate") {
      img.src = pick(GATE_IMAGES);
      img.alt = "Logic gate";
    } else {
      const bit = Math.random() < 0.5 ? "0" : "1";
      img.src = BIT_IMAGES[bit] || BIT_IMAGES["0"];
      img.alt = `Bit ${bit}`;
    }
    el.appendChild(img);
    floatLayer.appendChild(el);
  }
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* ================== NEW: FORCE AUTOPLAY (MUTED) + FADE-IN ================== */
/*
  Requirements:
  - <audio id="bg-music" autoplay playsinline loop preload="auto"> in HTML.
  - This block starts playback muted (allowed), then fades up to saved volume.
  - If unmute is blocked (iOS first visit), it keeps playing silently and shows hint; any tap unmutes.
*/
(function () {
  if (!music) return;

  // Ensure attributes are present even if missing in HTML
  music.setAttribute("autoplay", "");
  music.setAttribute("playsinline", "");
  music.setAttribute("loop", "");
  music.setAttribute("preload", "auto");

  // Read saved volume, default 0.5
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"); } catch {}
  const targetVol = typeof saved.volume === "number" ? saved.volume : 0.5;

  // Start muted so autoplay is permitted
  music.muted = true;
  music.volume = 0.0;

  const tryFadeIn = async () => {
    try {
      // Start playback pipeline ASAP
      if (music.readyState < 2) await music.play().catch(()=>{});
      if (music.paused) await music.play();

      // Attempt to unmute and fade up over ~1s
      music.muted = false;
      const steps = 20;
      let i = 0;
      const step = () => {
        i++;
        const v = Math.min(targetVol, (i / steps) * targetVol);
        music.volume = v;
        if (i < steps && !music.muted) setTimeout(step, 50);
      };
      step();

      // UI + settings
      setPlayingUI(true);
      hideAutoplayHint();
      updateSettings({ playing: true });
    } catch (e) {
      // Unmute blocked: keep playing silently; show hint and allow any tap/keypress to unmute
      showAutoplayHint();

      const resume = async () => {
        try {
          await music.play();
          music.muted = false;
          music.volume = targetVol;
          setPlayingUI(true);
          hideAutoplayHint();
          updateSettings({ playing: true });
          detach();
        } catch {}
      };
      function detach() {
        document.removeEventListener("pointerdown", resume);
        document.removeEventListener("keydown", resume);
      }
      document.addEventListener("pointerdown", resume);
      document.addEventListener("keydown", resume);
    }
  };

  // Kick as soon as possible
  if (document.readyState === "complete" || document.readyState === "interactive") {
    tryFadeIn();
  } else {
    document.addEventListener("DOMContentLoaded", tryFadeIn, { once: true });
  }

  // Helps in cases where page becomes visible after being hidden
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && music.paused) tryFadeIn();
  });
})();
