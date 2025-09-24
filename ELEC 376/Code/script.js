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
    volume: "Volume",
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

const FLOWER_IMAGES = [
  "assets/Flower1.png",
  "assets/Flower2.png"
];
const GATE_IMAGES = [
  "assets/AndGate.png",
  "assets/NotGate.png",
  "assets/OrGate.png"
];
const BIT_IMAGES = {
  "0": "assets/0.png",
  "1": "assets/1.png"
};

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
  btnPlay.textContent = pack.play;
  btnLearn.textContent = pack.learn;
  btnSandbox.textContent = pack.sandbox;


  if (autoplayHint) autoplayHint.textContent = pack.tapEnableAudio;

 
  toggleMusicBtn.textContent =
    toggleMusicBtn.getAttribute("aria-pressed") === "true"
      ? pack.musicPause
      : pack.musicPlay;


  if (lang === "ar") {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.lang = "ar";
  } else {
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.lang = lang;
  }
}
function applyMusic(volume = 0.5, playing = true) {
  music.volume = volume;
  volumeSlider.value = String(volume);
  toggleMusicBtn.setAttribute("aria-pressed", playing ? "true" : "false");
  toggleMusicBtn.textContent = playing ? t("musicPause") : t("musicPlay");
  if (playing) {
    attemptAutoplay();
  } else {
    music.pause();
  }
}
function applySfxVolume(v = 0.7) {
  sfx.volume = v;
  sfxSlider.value = String(v);
}

function t(key) {
  const lang = languageSelect.value || "en";
  return (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key] || key;
}

let autoplayArmed = false;
async function attemptAutoplay() {
  try {
    await music.play();
    hideAutoplayHint();
  } catch {

    showAutoplayHint();
    if (!autoplayArmed) {
      autoplayArmed = true;
      const resume = async () => {
        try {
          await music.play();
          hideAutoplayHint();
          document.removeEventListener("pointerdown", resume);
          document.removeEventListener("keydown", resume);
        } catch {}
      };
      document.addEventListener("pointerdown", resume, { once: true });
      document.addEventListener("keydown", resume, { once: true });
    }
  }
}
function showAutoplayHint() {
  if (autoplayHint) autoplayHint.hidden = false;
}
function hideAutoplayHint() {
  if (autoplayHint) autoplayHint.hidden = true;
}

(function init() {
  applyLanguage("en");

  const s = loadSettings();

  applyFontScale(s.fontScale ?? 100);
  applyTheme(s.theme ?? "light");
  applyLanguage(s.language ?? "en");
  // DEFAULT: playing true if not set yet
  applyMusic(s.volume ?? 0.5, s.playing ?? true);
  applySfxVolume(s.sfxVolume ?? 0.7);

  // reflect control states
  fontSize.value = s.fontScale ?? 100;
  languageSelect.value = s.language ?? "en";
  [...themeRadios].forEach(r => (r.checked = r.value === (s.theme ?? "light")));

  // spawn floaters using your images
  spawnFloaters(28);

  // button click SFX + (placeholder) navigation
  [btnPlay, btnLearn, btnSandbox].forEach(btn => {
    btn.addEventListener("click", () => {
      try {
        sfx.currentTime = 0;
        sfx.play().catch(()=>{});
      } catch {}
      console.log(btn.textContent + " clicked");
    });
  });
})();

function openModal() { modal.setAttribute("aria-hidden", "false"); fontSize.focus(); }
function closeModal() { modal.setAttribute("aria-hidden", "true"); }
openBtn.addEventListener("click", openModal);
closeBackdrop.addEventListener("click", closeModal);
xClose.addEventListener("click", closeModal);






function updateSettings(patch) {
  const s = { ...(loadSettings() || {}) , ...patch };
  saveSettings(s);
}
fontSize.addEventListener("input", (e) => {
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
languageSelect.addEventListener("change", (e) => {
  const language = e.target.value;
  applyLanguage(language);
  updateSettings({ language });
});

volumeSlider.addEventListener("input", (e) => {
  const v = Number(e.target.value);
  music.volume = v;
  updateSettings({ volume: v });
});


toggleMusicBtn.addEventListener("click", async () => {
  const isOn = toggleMusicBtn.getAttribute("aria-pressed") === "true";
  if (isOn) {
    music.pause();
    toggleMusicBtn.setAttribute("aria-pressed", "false");
    toggleMusicBtn.textContent = t("musicPlay");
    updateSettings({ playing: false });
  } else {
    await attemptAutoplay();
    toggleMusicBtn.setAttribute("aria-pressed", "true");
    toggleMusicBtn.textContent = t("musicPause");
    updateSettings({ playing: true });
  }
});


sfxSlider.addEventListener("input", (e) => {
  const v = Number(e.target.value);
  applySfxVolume(v);
  updateSettings({ sfxVolume: v });
});

// ---------- FLOATERS (using images) ----------
function spawnFloaters(count = 24) {
  const types = ["flower", "gate", "bit"];
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const el = document.createElement("div");
    el.className = "floater";

    // random starting position (% of viewport)
    const x = Math.random() * 100;
    const y = Math.random() * 100;

    // random drift deltas (in px)
    const xDelta = (Math.random() * 120 + 40) * (Math.random() < 0.5 ? -1 : 1);
    const yDelta = (Math.random() * 120 + 40) * (Math.random() < 0.5 ? -1 : 1);

    // random rotation in deg
    const rotStart = Math.floor(Math.random() * 360);
    const rotDelta = (Math.random() * 180 + 90) * (Math.random() < 0.5 ? -1 : 1);

    // random scale
    const scale = (Math.random() * 0.8 + 0.6).toFixed(2);

    // random duration & delay
    const dur = (Math.random() * 30 + 25).toFixed(2) + "s";
    const delay = (-Math.random() * 30).toFixed(2) + "s"; // negative to desync

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

    // choose image based on type
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