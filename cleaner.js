// Shared URL-cleaning logic used by both the popup and the service worker.
// Keeping it in one module prevents the two entry points from drifting apart.
//
// This file holds LOGIC ONLY. Every parameter name lives in `rules.json`, so
// rules can be reviewed, diffed and contributed without touching code, and so a
// future remote rules feed can reuse this exact parse path.
//
// Design rule: a param is only added to a GLOBAL set if it has no legitimate
// function anywhere (pure ad/analytics identifiers). Anything that could be
// meaningful on some site (search query, sort, share tokens like `s`/`t`) is
// scoped to the hosts where it is known to be tracking (hostRules).

export const DEFAULT_SETTINGS = {
  removeUtm: true,
  removeClickIds: true,
  removeRef: true,
  removeTextFragment: true,
};

// ── Rule loading ────────────────────────────────────────────────────────────
// Parameter names are lowercased here rather than trusted from the data file:
// the matcher lowercases the name it reads from the URL, so an entry like
// `sourceType` would otherwise never match and would fail silently.

const lower = (list) => (Array.isArray(list) ? list.map((s) => String(s).toLowerCase()) : []);

export function compileRules(raw) {
  if (!raw || typeof raw !== "object") return null;
  return {
    rulesVersion: raw.rulesVersion || "unknown",
    neverStrip: new Set(lower(raw.neverStrip)),
    campaignPrefixes: lower(raw.campaignPrefixes),
    clickIds: new Set(lower(raw.clickIds)),
    refTracking: new Set(lower(raw.refTracking)),
    trackingPrefixes: lower(raw.trackingPrefixes),
    siteTracking: new Set(lower(raw.siteTracking)),
    hostRules: (Array.isArray(raw.hostRules) ? raw.hostRules : []).map((r) => ({
      name: r.name || "",
      domains: lower(r.domains),
      domainsAnyTld: lower(r.domainsAnyTld),
      excludeHosts: lower(r.excludeHosts),
      params: new Set(lower(r.params)),
    })),
  };
}

let cachedRules = null;

// Loads the packaged rules.json. Cached after the first call.
export async function loadRules() {
  if (cachedRules) return cachedRules;
  const url = chrome.runtime.getURL("rules.json");
  const raw = await (await fetch(url)).json();
  cachedRules = compileRules(raw);
  return cachedRules;
}

// ── Host matching ───────────────────────────────────────────────────────────

function underDomain(host, domain) {
  return host === domain || host.endsWith("." + domain);
}

// Matches a brand across country TLDs: `google` -> google.com, google.co.uk.
// Trailing labels are capped at two so that google.com.example.org does not
// pick up Google's rules.
function underAnyTld(host, base) {
  const labels = host.split(".");
  const i = labels.lastIndexOf(base);
  if (i === -1 || i === labels.length - 1) return false;
  const tail = labels.slice(i + 1);
  return tail.length <= 2 && tail.every((l) => /^[a-z]{2,}$/.test(l));
}

function hostParamsFor(host, rules) {
  for (const rule of rules.hostRules) {
    if (rule.excludeHosts.some((e) => underDomain(host, e))) continue;
    const hit =
      rule.domains.some((d) => underDomain(host, d)) ||
      rule.domainsAnyTld.some((b) => underAnyTld(host, b));
    if (hit) return rule.params;
  }
  return null;
}

export function isValidHttpUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

// Returns { clean, removed, safe }. On any doubt it fails safe to the original URL.
export function cleanUrl(original, settings, rules) {
  // Fail-safe: only process http(s)
  if (!isValidHttpUrl(original)) {
    return { clean: original, removed: 0, safe: true };
  }

  // Fail-safe: without rules we must not guess at what to strip.
  if (!rules) {
    return { clean: original, removed: 0, safe: false };
  }

  let u;
  try {
    u = new URL(original);
  } catch {
    return { clean: original, removed: 0, safe: false };
  }

  const hostParams = settings.removeRef ? hostParamsFor(u.hostname.toLowerCase(), rules) : null;

  const toDelete = [];
  for (const [key] of u.searchParams) {
    const k = key.toLowerCase();

    // Absolute protection: destination parameters, access tokens and core
    // content identifiers are never removed, whatever the lists below say.
    if (rules.neverStrip.has(k)) continue;

    if (settings.removeUtm && rules.campaignPrefixes.some((p) => k.startsWith(p))) {
      toDelete.push(key);
      continue;
    }
    if (settings.removeClickIds && rules.clickIds.has(k)) {
      toDelete.push(key);
      continue;
    }
    if (settings.removeRef) {
      if (
        rules.refTracking.has(k) ||
        rules.siteTracking.has(k) ||
        (hostParams && hostParams.has(k)) ||
        rules.trackingPrefixes.some((p) => k.startsWith(p))
      ) {
        toDelete.push(key);
        continue;
      }
    }
  }

  // delete removes ALL instances of that key
  for (const k of toDelete) u.searchParams.delete(k);
  let removed = toDelete.length;

  // Optionally strip the :~: text-fragment directive (#:~:text=…),
  // keeping any real anchor before it (e.g. #section).
  if (settings.removeTextFragment && u.hash.includes(":~:")) {
    const before = u.hash.split(":~:")[0];
    u.hash = before === "#" ? "" : before;
    removed += 1;
  }

  const out = u.toString();

  // Edge fail-safe: if cleaning produced an invalid/empty string, fall back.
  if (!out || !isValidHttpUrl(out)) {
    return { clean: original, removed: 0, safe: false };
  }

  return { clean: out, removed, safe: true };
}
