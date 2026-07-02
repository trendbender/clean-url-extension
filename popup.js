const DEFAULT_SETTINGS = {
  removeUtm: true,
  removeClickIds: true,
  removeRef: true
};

const CLICK_IDS = new Set(["gclid","gbraid","wbraid","fbclid","msclkid","ttclid","yclid","dclid","gclsrc"]);
const REF_TRACKING = new Set(["ref","ref_src","igshid","mc_cid","mc_eid","vero_id","s_cid","gad_source","gad_campaignid","adid","campaignid","term"]);
// Site-specific tracking params (LinkedIn: lipi/lici/trk are page-instance & source trackers)
const SITE_TRACKING = new Set(["lipi","lici","trk","trkinfo","refid","midtoken","midsig","otptoken","originalreferer"]);
const UTM_PREFIX = "utm_";

const els = {
  originalUrl: document.getElementById("originalUrl"),
  cleanUrl: document.getElementById("cleanUrl"),
  removedHint: document.getElementById("removedHint"),
  status: document.getElementById("status"),

  toggleUtm: document.getElementById("toggleUtm"),
  toggleClickIds: document.getElementById("toggleClickIds"),
  toggleRef: document.getElementById("toggleRef"),

  btnCopyClean: document.getElementById("btnCopyClean"),
  btnCopyOriginal: document.getElementById("btnCopyOriginal"),
  btnOpenClean: document.getElementById("btnOpenClean"),
};

let currentOriginal = "";
let currentClean = "";
let removedCount = 0;

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

function isValidHttpUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function cleanUrl(original, settings) {
  removedCount = 0;

  // Fail-safe: only process http(s)
  if (!isValidHttpUrl(original)) {
    return { clean: original, removed: 0, safe: true };
  }

  let u;
  try {
    u = new URL(original);
  } catch {
    return { clean: original, removed: 0, safe: false };
  }

  const toDelete = [];
  for (const [key] of u.searchParams) {
    const k = key.toLowerCase();

    if (settings.removeUtm && k.startsWith(UTM_PREFIX)) {
      toDelete.push(key);
      continue;
    }
    if (settings.removeClickIds && CLICK_IDS.has(k)) {
      toDelete.push(key);
      continue;
    }
    if (settings.removeRef) {
      // Includes mc_* keys and site-specific trackers (LinkedIn lipi/trk, etc.)
      if (REF_TRACKING.has(k) || SITE_TRACKING.has(k) || k.startsWith("mc_")) {
        toDelete.push(key);
        continue;
      }
    }
  }

  // Remove
  for (const k of toDelete) {
    // delete removes ALL instances of that key
    u.searchParams.delete(k);
  }
  removedCount = toDelete.length;

  // Preserve hash is handled by URL automatically (u.hash)
  // Ensure valid output
  const out = u.toString();

  // Edge fail-safe: if cleaning produced an invalid/empty string, fallback
  if (!out || !isValidHttpUrl(out)) {
    return { clean: original, removed: 0, safe: false };
  }

  return { clean: out, removed: removedCount, safe: true };
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
    removeRef: data.removeRef ?? true
  };
}

async function saveSettings(settings) {
  await chrome.storage.local.set(settings);
}

function readSettingsFromUI() {
  return {
    removeUtm: !!els.toggleUtm.checked,
    removeClickIds: !!els.toggleClickIds.checked,
    removeRef: !!els.toggleRef.checked
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

  const url = await getActiveTabUrl();
  render(settings, url);
})();
