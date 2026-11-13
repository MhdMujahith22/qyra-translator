// Supported languages
const LANGS = [
  { name: "Tamil",      speech: "ta-IN", code: "ta" },
  { name: "English",    speech: "en-US", code: "en" },
  { name: "Chinese",    speech: "zh-CN", code: "zh-CN" },
  { name: "Sinhala",    speech: "si-LK", code: "si" },
  { name: "Hindi",      speech: "hi-IN", code: "hi" },
  { name: "Urdu",       speech: "ur-PK", code: "ur" },
  { name: "Bengali",    speech: "bn-BD", code: "bn" },
  { name: "Japanese",   speech: "ja-JP", code: "ja" },
  { name: "Korean",     speech: "ko-KR", code: "ko" },
  { name: "Arabic",     speech: "ar-SA", code: "ar" },
  { name: "French",     speech: "fr-FR", code: "fr" },
  { name: "German",     speech: "de-DE", code: "de" },
  { name: "Spanish",    speech: "es-ES", code: "es" },
  { name: "Portuguese", speech: "pt-BR", code: "pt" },
  { name: "Italian",    speech: "it-IT", code: "it" },
  { name: "Russian",    speech: "ru-RU", code: "ru" },
  { name: "Turkish",    speech: "tr-TR", code: "tr" },
  { name: "Vietnamese", speech: "vi-VN", code: "vi" },
  { name: "Thai",       speech: "th-TH", code: "th" },
  { name: "Indonesian", speech: "id-ID", code: "id" },
  { name: "Malay",      speech: "ms-MY", code: "ms" },
  { name: "Persian",    speech: "fa-IR", code: "fa" },
  { name: "Polish",     speech: "pl-PL", code: "pl" },
  { name: "Dutch",      speech: "nl-NL", code: "nl" },
  { name: "Swedish",    speech: "sv-SE", code: "sv" },
  { name: "Greek",      speech: "el-GR", code: "el" },
  { name: "Hebrew",     speech: "he-IL", code: "iw", tts: "he" },
  { name: "Ukrainian",  speech: "uk-UA", code: "uk" },
  { name: "Czech",      speech: "cs-CZ", code: "cs" },
  { name: "Romanian",   speech: "ro-RO", code: "ro" },
  { name: "Hungarian",  speech: "hu-HU", code: "hu" },
  { name: "Finnish",    speech: "fi-FI", code: "fi" },
  { name: "Danish",     speech: "da-DK", code: "da" },
  { name: "Norwegian",  speech: "nb-NO", code: "no" },
  { name: "Swahili",    speech: "sw-KE", code: "sw" },
  { name: "Filipino",   speech: "fil-PH", code: "tl" },
  { name: "Nepali",     speech: "ne-NP", code: "ne" },
  { name: "Telugu",     speech: "te-IN", code: "te" },
  { name: "Kannada",    speech: "kn-IN", code: "kn" },
  { name: "Malayalam",  speech: "ml-IN", code: "ml" },
  { name: "Marathi",    speech: "mr-IN", code: "mr" },
  { name: "Gujarati",   speech: "gu-IN", code: "gu" },
  { name: "Punjabi",    speech: "pa-IN", code: "pa" }
];

// Application state and helpers
const state = { from: 0, to: 2, hue: 270 };
const $ = (id) => document.getElementById(id);

const micBtn = $("micBtn");
const micWrap = $("micWrap");
const swapBtn = $("swapBtn");
const clearBtn = $("clearBtn");
const originalEl = $("original");
const translatedEl = $("translated");
const statusEl = $("status");
const card = $("card");
const sheen = document.querySelector(".sheen");
const fromDd = $("fromDd");
const toDd = $("toDd");
const welcomeEl = $("welcome");
const welcomeCard = document.querySelector(".welcome-card");
const startBtn = $("startBtn");
const sceneEl = $("scene");

const DEFAULT_STATUS = "Tap Qyra to speak";

// Status messages
function say(msg, isErr = false) {
  console.log("[Qyra]", msg);
  statusEl.textContent = msg;
  statusEl.classList.toggle("err", isErr);
}

// Adjust card width to fit the text
const CARD_MIN_W = 420;
function fitCard() {
  const len = Math.max(
    (originalEl.textContent || "").length,
    (translatedEl.textContent || "").length
  );
  const maxW = Math.min(780, window.innerWidth * 0.94);
  const target = Math.min(maxW, CARD_MIN_W + len * 2.5);
  card.style.width = Math.max(CARD_MIN_W, target) + "px";
}

// Show or hide the clear button
function showClear() {
  clearBtn.classList.remove("hidden");
  clearBtn.classList.add("show");
}

function hideClear() {
  clearBtn.classList.remove("show");
  clearBtn.classList.add("hidden");
}

// Render text with a wave animation
function renderWave(el, text, dir) {
  el.textContent = "";
  el.classList.add("wv", dir);
  const tokens = text.match(/\S+|\s+/g) || [];
  let idx = 0;
  tokens.forEach((tok) => {
    if (/^\s+$/.test(tok)) {
      el.appendChild(document.createTextNode(tok));
    } else {
      const s = document.createElement("span");
      s.className = "w";
      s.textContent = tok;
      s.style.setProperty("--d", (idx * 0.12) + "s");
      el.appendChild(s);
      idx++;
    }
  });
}

// Reveal the translator panel
let sceneShown = false;
function revealScene() {
  if (sceneShown) return;
  sceneShown = true;
  sceneEl.classList.add("show");
}

// Fade in the background before showing the translator panel
function startExperience() {
  document.body.classList.add("orb-visible");
  window.setTimeout(revealScene, 1100);
}

// Update the theme color
function setHue(h) {
  state.hue = h;
  document.documentElement.style.setProperty("--hue", h.toFixed(1));
}

// Build the language dropdowns
function buildDD(dd, key) {
  dd.innerHTML = `<button class="dd-btn"><span></span><i>▾</i></button><div class="dd-menu"></div>`;
  const menu = dd.querySelector(".dd-menu");

  LANGS.forEach((lang, i) => {
    const item = document.createElement("div");
    item.className = "dd-item";
    item.textContent = lang.name;
    item.onclick = (e) => {
      e.stopPropagation();
      state[key] = i;
      dd.classList.remove("open");
      render();
      console.log("[Qyra] From:", LANGS[state.from].name, "| To:", LANGS[state.to].name);
    };
    menu.appendChild(item);
  });

  dd.querySelector(".dd-btn").onclick = (e) => {
    e.stopPropagation();
    document.querySelectorAll(".dd.open").forEach((d) => {
      if (d !== dd) d.classList.remove("open");
    });
    dd.classList.toggle("open");
  };

  menu.addEventListener("mousemove", (e) => {
    const r = menu.getBoundingClientRect();
    menu.style.setProperty("--x", (e.clientX - r.left) + "px");
    menu.style.setProperty("--y", (e.clientY - r.top) + "px");
  });
}

function render() {
  fromDd.querySelector(".dd-btn span").textContent = LANGS[state.from].name;
  toDd.querySelector(".dd-btn span").textContent = LANGS[state.to].name;
  [[fromDd, state.from], [toDd, state.to]].forEach(([dd, idx]) => {
    dd.querySelectorAll(".dd-item").forEach((it, i) => it.classList.toggle("sel", i === idx));
  });
}

buildDD(fromDd, "from");
buildDD(toDd, "to");
render();

document.addEventListener("click", () => {
  document.querySelectorAll(".dd.open").forEach((d) => d.classList.remove("open"));
});

swapBtn.onclick = () => {
  [state.from, state.to] = [state.to, state.from];
  render();
};

// Track pointer movement over the card
let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

function setMouse(clientX, clientY) {
  mouseX = (clientX / window.innerWidth) * 2 - 1;
  mouseY = (clientY / window.innerHeight) * 2 - 1;
}
window.addEventListener("mousemove", (e) => setMouse(e.clientX, e.clientY));
window.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  setMouse(t.clientX, t.clientY);
}, { passive: true });

let activeTimer;
card.addEventListener("mousemove", () => {
  card.classList.add("active");
  clearTimeout(activeTimer);
  activeTimer = setTimeout(() => card.classList.remove("active"), 900);
});
card.addEventListener("mouseleave", () => card.classList.remove("active"));

// Translate text using Google with MyMemory as a fallback
async function translateWithGoogle(text, fromCode, toCode) {
  const url = "https://translate.googleapis.com/translate_a/single?client=gtx" +
    "&sl=" + encodeURIComponent(fromCode) +
    "&tl=" + encodeURIComponent(toCode) +
    "&dt=t&q=" + encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Google HTTP " + res.status);
  const data = await res.json();
  const out = (data[0] || []).map((part) => part[0]).join("");
  if (!out.trim()) throw new Error("Google empty result");
  return out;
}

async function translateWithMyMemory(text, fromCode, toCode) {
  const langPair = fromCode + "|" + toCode;
  const url = "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(text) + "&langpair=" + encodeURIComponent(langPair);
  const res = await fetch(url);
  const data = await res.json();
  const out = (data.responseData && data.responseData.translatedText) || "";
  if (Number(data.responseStatus) !== 200) throw new Error(data.responseDetails || "MyMemory error");
  if (!out.trim() || out.includes("MYMEMORY WARNING")) throw new Error("MyMemory daily limit");
  return out;
}

async function translate(text, fromCode, toCode) {
  try {
    return await translateWithGoogle(text, fromCode, toCode);
  } catch (e) {
    console.log("Google translate failed, trying MyMemory:", e.message);
    return await translateWithMyMemory(text, fromCode, toCode);
  }
}

// Select a speech voice
function findVoice(speechLang, availableVoices) {
  if (!("speechSynthesis" in window)) return undefined;
  const voices = availableVoices || speechSynthesis.getVoices();
  const target = speechLang.toLowerCase().replace("_", "-");
  const base = target.split("-")[0];
  return (
    voices.find((v) => v.lang.toLowerCase().replace("_", "-") === target) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(base + "-")) ||
    voices.find((v) => v.lang.toLowerCase() === base)
  );
}

function waitForSpeechVoices(timeoutMs = 800) {
  if (!("speechSynthesis" in window)) return Promise.resolve([]);
  const currentVoices = speechSynthesis.getVoices();
  if (currentVoices.length) return Promise.resolve(currentVoices);

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      speechSynthesis.removeEventListener("voiceschanged", finish);
      resolve(speechSynthesis.getVoices());
    };
    const timer = setTimeout(finish, timeoutMs);
    speechSynthesis.addEventListener("voiceschanged", finish, { once: true });
  });
}

let currentAudio = null;
let speaking = false;
let speakToken = 0;   // Clear / new speech pannaa increment aagum, pazhaya speech stop aagum

function stopAllVoice() {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

// Split long text into speech sized chunks
function splitText(text, max = 180) {
  const chunks = [];
  let rest = text.trim();
  while (rest.length > max) {
    let cut = rest.lastIndexOf(" ", max);
    if (cut <= 0) cut = max;
    chunks.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) chunks.push(rest);
  return chunks;
}

// Try both Google speech clients
const TTS_CLIENTS = ["tw-ob", "gtx"];

function playOnlineVoice(text, lang, onDone, token, onFailure) {
  const chunks = splitText(text);
  const ttsCodes = [...new Set([lang.tts, lang.code, lang.speech].filter(Boolean))];
  const attempts = ttsCodes.flatMap((code) => TTS_CLIENTS.map((client) => ({ code, client })));
  let i = 0;
  let attemptIdx = 0;
  let timeoutId = null;

  const alive = () => token === speakToken;

  const finishAll = () => {
    if (!alive()) return;
    clearTimeout(timeoutId);
    speaking = false;
    micBtn.classList.remove("speaking");
    if (onDone) onDone();
  };

  const failAll = () => {
    if (!alive()) return;
    clearTimeout(timeoutId);
    currentAudio = null;
    if (onFailure) onFailure();
    else {
      say("Voice playback failed for " + lang.name + ". Please try again.", true);
      finishAll();
    }
  };

  const playChunk = () => {
    if (!alive()) return;
    if (i >= chunks.length) return finishAll();

    const attempt = attempts[attemptIdx];
    const url = "https://translate.google.com/translate_tts?ie=UTF-8" +
      "&client=" + attempt.client +
      "&tl=" + encodeURIComponent(attempt.code) +
      "&q=" + encodeURIComponent(chunks[i]);

    console.log("TTS try:", attempt.code, attempt.client);
    const audio = new Audio(url);
    currentAudio = audio;

    audio.onended = () => {
      if (!alive() || currentAudio !== audio) return;
      clearTimeout(timeoutId);
      i++;
      attemptIdx = 0;
      playChunk();
    };

    audio.onerror = () => {
      if (!alive() || currentAudio !== audio) return;
      clearTimeout(timeoutId);
      attemptIdx++;
      if (attemptIdx < attempts.length) return playChunk();
      failAll();
    };

    timeoutId = setTimeout(() => {
      if (!alive() || currentAudio !== audio) return;
      audio.onerror();
    }, 12000);
    audio.play().catch((err) => {
      if (!alive() || currentAudio !== audio) return;
      if (err.name === "NotAllowedError") {
        failAll();
      } else audio.onerror();
    });
  };

  playChunk();
}

async function speakText(text, lang, onDone) {
  stopAllVoice();
  const token = ++speakToken;

  speaking = true;
  micBtn.classList.add("speaking");

  const finish = () => {
    if (token !== speakToken) return;
    speaking = false;
    micBtn.classList.remove("speaking");
    if (onDone) onDone();
  };

  let voice = findVoice(lang.speech);
  if (!voice && "speechSynthesis" in window && speechSynthesis.getVoices().length === 0) {
    const voices = await waitForSpeechVoices();
    if (token !== speakToken) return;
    voice = findVoice(lang.speech, voices);
  }
  const failMessage = () => {
    say("I couldn't play the " + lang.name + " voice in this browser. Try again or choose another language.", true);
    finish();
  };

  const playSystemVoice = (selectedVoice, onError) => {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      onError();
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang.speech;
    if (selectedVoice) utter.voice = selectedVoice;
    utter.onend = finish;
    utter.onerror = () => {
      if (token !== speakToken) return;
      speechSynthesis.cancel();
      onError();
    };
    try {
      speechSynthesis.speak(utter);
    } catch (e) {
      onError();
    }
  };

  if (voice) {
    playSystemVoice(voice, () => {
      playOnlineVoice(text, lang, onDone, token, failMessage);
    });
  } else {
    playOnlineVoice(text, lang, onDone, token, () => playSystemVoice(null, failMessage));
  }
}

// Clear translated text and stop speech
function clearAll() {
  console.log("[Qyra] Clear clicked");

  // Ignore callbacks from previous speech
  speakToken++;

  // Stop voice playback
  try {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  } catch (e) {}
  try {
    if (currentAudio) {
      currentAudio.onended = null;
      currentAudio.onerror = null;
      currentAudio.pause();
      currentAudio = null;
    }
  } catch (e) {}
  speaking = false;
  micBtn.classList.remove("speaking");

  // Stop microphone recognition
  try {
    if (mainRec && listening) mainRec.abort();
  } catch (e) {}

  // Reset displayed text
  originalEl.className = "text";
  translatedEl.className = "text translated";
  originalEl.textContent = "...";
  translatedEl.textContent = "...";

  // Hide the clear button and reset card width
  hideClear();
  try {
    card.style.width = CARD_MIN_W + "px";
  } catch (e) {}

  say(DEFAULT_STATUS);
}

// Handle the clear click before other listeners
clearBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  clearAll();
}, true);

// Speech recognition
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

// Match common variations of the wake phrase
const WAKE_REGEX = /\b(hey|hi|hay|hei|he)\W+(q|k|c|ch)\w{0,2}\s?(ra|re|ro|ira|eira)\b/i;

let mainRec = null;
let wakeRec = null;
let listening = false;
let gotResult = false;
let mainErr = false;

let wakeEnabled = false;
let wakeOn = false;
let wakeHold = false;

function startWake() {
  if (!SR || !wakeEnabled || wakeOn || wakeHold || listening) return;
  try {
    wakeRec.start();
    wakeOn = true;
  } catch (e) {
    // Ignore attempts to start an active recognizer
  }
}

function startMain() {
  if (!mainRec || listening) return;
  stopAllVoice();
  wakeHold = true;
  wakeOn = false;
  try { wakeRec.abort(); } catch (e) {}

  micBtn.classList.add("touched");

  setTimeout(() => {
    mainRec.lang = LANGS[state.from].speech;
    console.log("Main mic lang:", mainRec.lang);
    try {
      mainRec.start();
    } catch (e) {
      wakeHold = false;
      say("Microphone is busy. Please refresh the page and try again.", true);
      setTimeout(startWake, 800);
    }
  }, 600);
}

function stopMain() {
  if (mainRec && listening) mainRec.stop();
}

function enableWake() {
  if (!SR || wakeEnabled) return;
  wakeEnabled = true;
  startWake();
}

if (!SR) {
  say("This browser does not support speech. Please use Chrome.", true);
  micBtn.disabled = true;
} else {
  // Main microphone for translation
  mainRec = new SR();
  mainRec.continuous = false;
  mainRec.interimResults = false;

  mainRec.onstart = () => {
    listening = true;
    micBtn.classList.add("listening", "touched");
    micWrap.classList.add("listening");
    say("Listening... speak in " + LANGS[state.from].name);
  };

  mainRec.onresult = async (event) => {
    gotResult = true;
    const text = event.results[0][0].transcript;
    const from = LANGS[state.from];
    const to = LANGS[state.to];
    console.log("Heard:", text, "| from:", from.name, "to:", to.name);
    renderWave(originalEl, text, "left");

    if (state.from === state.to) {
      say("From and To languages are the same. Please choose a different language.", true);
      return;
    }

    say("Translating...");
    try {
      const translated = await translate(text, from.code, to.code);
      renderWave(translatedEl, translated, "right");
      showClear();
      fitCard();
      say("Speaking in " + to.name + "...");
      speakText(translated, to, () => say(DEFAULT_STATUS));
    } catch (err) {
      console.log("Translate error:", err.message);
      say("Translation failed: " + err.message, true);
    }
  };

  mainRec.onerror = (e) => {
    mainErr = true;
    console.log("Mic error:", e.error);
    if (e.error === "no-speech")          say("I did not hear anything. Please speak closer to the mic.", true);
    else if (e.error === "not-allowed")   say("Microphone permission is blocked. Allow it in the browser.", true);
    else if (e.error === "network")       say("Network error. Check your internet connection.", true);
    else if (e.error === "audio-capture") say("No microphone found. Connect a mic and try again.", true);
    else if (e.error !== "aborted")       say("Mic error: " + e.error, true);
  };

  mainRec.onend = () => {
    listening = false;
    micBtn.classList.remove("listening", "touched");
    micWrap.classList.remove("listening");
    if (!gotResult && !mainErr) say("I did not catch that. Tap Qyra and try again.", true);
    gotResult = false;
    mainErr = false;
    wakeHold = false;
    setTimeout(startWake, 800);
  };

  // Listen for the wake phrase
  wakeRec = new SR();
  wakeRec.continuous = true;
  wakeRec.interimResults = true;
  wakeRec.lang = "en-US";

  wakeRec.onstart = () => {
    console.log("[Qyra] Wake listener started");
  };

  wakeRec.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const said = event.results[i][0].transcript;
      console.log("Wake heard:", said);
      if (WAKE_REGEX.test(said)) {
        console.log("Wake word matched:", said);
        revealScene();
        wakeHold = true;
        wakeOn = false;
        try { wakeRec.abort(); } catch (e) {}
        say("Hey Qyra! Speak now.");
        setTimeout(startMain, 500);
        return;
      }
    }
  };

  wakeRec.onend = () => {
    wakeOn = false;
    if (wakeEnabled && !wakeHold && !listening) setTimeout(startWake, 400);
  };

  wakeRec.onerror = (e) => {
    wakeOn = false;
    console.log("Wake error:", e.error);
    if (e.error === "not-allowed" || e.error === "service-not-allowed") {
      wakeEnabled = false;
      say("Allow microphone permission to use 'Hey Qyra'.", true);
    }
  };
}

micBtn.onclick = () => {
  revealScene();
  enableWake();
  if (listening) stopMain();
  else startMain();
};

// Welcome message behavior
welcomeCard.addEventListener("pointermove", (e) => {
  const rect = welcomeCard.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  welcomeCard.style.setProperty("--tilt-x", ((x - 0.5) * 16).toFixed(2) + "deg");
  welcomeCard.style.setProperty("--tilt-y", ((0.5 - y) * 16).toFixed(2) + "deg");
});
welcomeCard.addEventListener("pointerleave", () => {
  welcomeCard.style.setProperty("--tilt-x", "0deg");
  welcomeCard.style.setProperty("--tilt-y", "0deg");
});

function closeWelcome() {
  welcomeEl.classList.add("hide");
  enableWake();
  say('tap the Qyra to speak');
  startExperience();
}
startBtn.addEventListener("click", closeWelcome);

// Animated background
const canvas = $("bg");
const bgCtx = canvas.getContext("2d");
let W, H;
const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

function resize() {
  W = window.innerWidth;
  H = window.innerHeight;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, isCoarsePointer ? 1 : 1.25);
  canvas.width = Math.round(W * pixelRatio);
  canvas.height = Math.round(H * pixelRatio);
  bgCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}
resize();
window.addEventListener("resize", resize);

const particles = Array.from({ length: isCoarsePointer ? 38 : 72 }, () => ({
  x: Math.random(),
  y: Math.random(),
  z: Math.random() * 0.8 + 0.2,
  s: Math.random() * 1.5 + 0.5
}));

function drawOrbBg(cx, cy, r, t, hue) {
  const grad = bgCtx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 1.4);
  grad.addColorStop(0, `hsla(${hue}, 100%, 60%, 0.35)`);
  grad.addColorStop(0.6, `hsla(${hue}, 100%, 30%, 0.12)`);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  bgCtx.fillStyle = grad;
  bgCtx.beginPath();
  bgCtx.arc(cx, cy, r * 1.4, 0, Math.PI * 2);
  bgCtx.fill();

  bgCtx.shadowColor = `hsl(${hue}, 100%, 60%)`;
  bgCtx.shadowBlur = isCoarsePointer ? 10 : 18;
  bgCtx.strokeStyle = `hsla(${hue}, 100%, 75%, 0.7)`;
  bgCtx.lineWidth = 1.4;

  for (let i = 0; i < 6; i++) {
    bgCtx.save();
    bgCtx.translate(cx, cy);
    bgCtx.rotate(i * (Math.PI / 6) + t * 0.0002);
    bgCtx.beginPath();
    bgCtx.ellipse(0, 0, r, r * (0.25 + 0.6 * Math.abs(Math.sin(t * 0.0005 + i))), 0, 0, Math.PI * 2);
    bgCtx.stroke();
    bgCtx.restore();
  }
  bgCtx.shadowBlur = 0;
}

const frameInterval = isCoarsePointer ? 1000 / 30 : 1000 / 45;
let lastFrame = 0;
let lastHueUpdate = 0;
function animate(t) {
  if (document.hidden) return;
  if (t - lastFrame < frameInterval) {
    requestAnimationFrame(animate);
    return;
  }
  const frameScale = lastFrame ? Math.min(2, (t - lastFrame) / (1000 / 60)) : 1;
  lastFrame = t;

  state.hue = (state.hue + (listening || speaking ? 4 : 0.25) * frameScale) % 360;
  if (t - lastHueUpdate >= 80) {
    setHue(state.hue);
    lastHueUpdate = t;
  }

  const nextX = curX + (mouseX - curX) * 0.05;
  const nextY = curY + (mouseY - curY) * 0.05;
  const pointerMoved = Math.abs(nextX - curX) > 0.001 || Math.abs(nextY - curY) > 0.001;
  curX = nextX;
  curY = nextY;

  bgCtx.fillStyle = "rgba(5, 3, 10, 0.3)";
  bgCtx.fillRect(0, 0, W, H);

  for (const p of particles) {
    const px = p.x * W - curX * 40 * p.z;
    const py = p.y * H - curY * 40 * p.z;
    bgCtx.fillStyle = `hsla(${state.hue}, 80%, 85%, ${0.2 + p.z * 0.5})`;
    bgCtx.beginPath();
    bgCtx.arc(px, py, p.s * p.z, 0, Math.PI * 2);
    bgCtx.fill();
  }

  drawOrbBg(W / 2 + curX * 60, H * 0.38 + curY * 40, Math.min(W, H) * 0.14, t, state.hue);

  if (pointerMoved) {
    card.style.transform = `rotateY(${curX * 20}deg) rotateX(${-curY * 14}deg)`;
    sheen.style.setProperty("--mx", ((curX + 1) / 2) * 100 + "%");
    sheen.style.setProperty("--my", ((curY + 1) / 2) * 100 + "%");
  }

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    lastFrame = 0;
    requestAnimationFrame(animate);
  }
});
