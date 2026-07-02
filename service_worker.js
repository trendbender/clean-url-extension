// MV3 service worker
// Context menu: copy a cleaned URL for the current page or a link.

import { DEFAULT_SETTINGS, cleanUrl } from "./cleaner.js";

async function loadSettings() {
  const data = await chrome.storage.local.get(DEFAULT_SETTINGS);
  return {
    removeUtm: data.removeUtm ?? true,
    removeClickIds: data.removeClickIds ?? true,
    removeRef: data.removeRef ?? true,
    removeTextFragment: data.removeTextFragment ?? true,
  };
}

async function setBadge(text) {
  try {
    await chrome.action.setBadgeBackgroundColor({ color: "#22c55e" });
    await chrome.action.setBadgeText({ text });
    setTimeout(() => chrome.action.setBadgeText({ text: "" }), 1200);
  } catch {
    // ignore
  }
}

async function copyViaInjectedScript(tabId, text) {
  // Clipboard from a service worker is not reliable in MV3.
  // Inject into the page and copy there; verify result.
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    args: [text],
    func: (value) => {
      const fallbackCopy = (v) => {
        const ta = document.createElement("textarea");
        ta.value = v;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        ta.style.left = "-9999px";
        document.documentElement.appendChild(ta);
        ta.focus();
        ta.select();
        ta.setSelectionRange(0, ta.value.length);
        let ok = false;
        try {
          ok = document.execCommand("copy");
        } catch {
          ok = false;
        }
        ta.remove();
        return ok;
      };

      // Try modern API first (may fail depending on page / permissions).
      try {
        // navigator.clipboard might be blocked in some contexts; keep it best-effort.
        if (navigator.clipboard && navigator.clipboard.writeText) {
          // Fire-and-forget; some Chromium versions require async permission.
          navigator.clipboard.writeText(value);
          // If it didn't throw synchronously, still do fallback for reliability.
        }
      } catch {
        // ignore
      }

      return fallbackCopy(value);
    },
  });

  const ok = Array.isArray(results) && results[0] && results[0].result === true;
  if (!ok) throw new Error("Copy failed");
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "copy_clean_page",
      title: chrome.i18n.getMessage("ctxCopyCleanPage") || "Copy Clean URL (page)",
      contexts: ["page"],
    });
    chrome.contextMenus.create({
      id: "copy_clean_link",
      title: chrome.i18n.getMessage("ctxCopyCleanLink") || "Copy Clean URL (link)",
      contexts: ["link"],
    });
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const tabId = tab?.id;
  if (!tabId) return;

  const original = info.menuItemId === "copy_clean_link" ? info.linkUrl : tab.url;
  if (!original) return;

  const settings = await loadSettings();
  const result = cleanUrl(original, settings);
  const out = result.safe ? result.clean : original;

  try {
    await copyViaInjectedScript(tabId, out);
    await setBadge("✓");
  } catch {
    await setBadge("!");
  }
});
