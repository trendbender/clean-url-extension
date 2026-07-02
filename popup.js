import { DEFAULT_SETTINGS, cleanUrl, isValidHttpUrl } from "./cleaner.js";

const els = {
  originalUrl: document.getElementById("originalUrl"),
  cleanUrl: document.getElementById("cleanUrl"),
  removedHint: document.getElementById("removedHint"),
  status: document.getElementById("status"),

  toggleUtm: document.getElementById("toggleUtm"),
  toggleClickIds: document.getElementById("toggleClickIds"),
  toggleRef: document.getElementById("toggleRef"),
  toggleTextFragment: document.getElementById("toggleTextFragment"),

  btnCopyClean: document.getElementById("btnCopyClean"),
  btnCopyOriginal: document.getElementById("btnCopyOriginal"),
  btnOpenClean: document.getElementById("btnOpenClean"),
};

let currentOriginal = "";
let currentClean = "";

// i18n helper: returns the localized message, falling back to the key.
function t(key, subs) {
  return chrome.i18n.getMessage(key, subs) || key;
}

// Replace all [data-i18n] text and set <html lang> to the UI locale.
function applyStaticI18n() {
  const uiLocale = chrome.i18n.getMessage("@@ui_locale");
  if (uiLocale) document.documentElement.lang = uiLocale.replace("_", "-");
  document.title = t("appTitle");
  for (const el of document.querySelectorAll("[data-i18n]")) {
    const msg = t(el.dataset.i18n);
    if (msg) el.textContent = msg;
  }
}

function setStatus(msg, kind = "") {
  els.status.textContent = msg || "";
  els.status.className = "status " + (kind || "");
}

function normalizeUrlForDisplay(url) {
  try { return decodeURI(url); } catch { return url; }
}

async function getActiveTabUrl() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.url || "";
}

async function loadSettings() {
  const data = await chrome.storage.local.get(DEFAULT_SETTINGS);
  return {
    removeUtm: data.removeUtm ?? true,
    removeClickIds: data.removeClickIds ?? true,
    removeRef: data.removeRef ?? true,
    removeTextFragment: data.removeTextFragment ?? true,
  };
}

async function saveSettings(settings) {
  await chrome.storage.local.set(settings);
}

function readSettingsFromUI() {
  return {
    removeUtm: !!els.toggleUtm.checked,
    removeClickIds: !!els.toggleClickIds.checked,
    removeRef: !!els.toggleRef.checked,
    removeTextFragment: !!els.toggleTextFragment.checked,
  };
}

function render(settings, original) {
  currentOriginal = original || "";
  els.originalUrl.value = normalizeUrlForDisplay(currentOriginal);

  const result = cleanUrl(currentOriginal, settings);
  currentClean = result.clean;

  els.cleanUrl.value = normalizeUrlForDisplay(currentClean);
  els.removedHint.textContent = t("removedParams", [String(result.removed)]);

  if (!result.safe) {
    setStatus(t("statusFailsafe"), "err");
  } else {
    setStatus("");
  }
}

async function copyToClipboard(text) {
  // navigator.clipboard should work in extension popup contexts
  await navigator.clipboard.writeText(text);
}

function wireEvents() {
  const onToggle = async () => {
    const settings = readSettingsFromUI();
    await saveSettings(settings);
    render(settings, currentOriginal);
  };

  els.toggleUtm.addEventListener("change", onToggle);
  els.toggleClickIds.addEventListener("change", onToggle);
  els.toggleRef.addEventListener("change", onToggle);
  els.toggleTextFragment.addEventListener("change", onToggle);

  els.btnCopyClean.addEventListener("click", async () => {
    try {
      await copyToClipboard(currentClean || "");
      setStatus(t("statusCopiedClean"), "ok");
    } catch {
      setStatus(t("statusClipboardBlocked"), "err");
    }
  });

  els.btnCopyOriginal.addEventListener("click", async () => {
    try {
      await copyToClipboard(currentOriginal || "");
      setStatus(t("statusCopiedOriginal"), "ok");
    } catch {
      setStatus(t("statusClipboardBlocked"), "err");
    }
  });

  els.btnOpenClean.addEventListener("click", async () => {
    if (!currentClean || !isValidHttpUrl(currentClean)) return;
    await chrome.tabs.create({ url: currentClean });
    window.close();
  });
}

(async function init() {
  applyStaticI18n();
  wireEvents();

  const settings = await loadSettings();
  els.toggleUtm.checked = settings.removeUtm;
  els.toggleClickIds.checked = settings.removeClickIds;
  els.toggleRef.checked = settings.removeRef;
  els.toggleTextFragment.checked = settings.removeTextFragment;

  const url = await getActiveTabUrl();
  render(settings, url);
})();
