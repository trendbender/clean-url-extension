// Shared URL-cleaning logic used by both the popup and the service worker.
// Keeping it in one module prevents the two entry points from drifting apart.

export const DEFAULT_SETTINGS = {
  removeUtm: true,
  removeClickIds: true,
  removeRef: true,
  removeTextFragment: true,
};

const UTM_PREFIX = "utm_";
const CLICK_IDS = new Set(["gclid","gbraid","wbraid","fbclid","msclkid","ttclid","yclid","dclid","gclsrc","srsltid"]);
const REF_TRACKING = new Set(["ref","ref_src","igshid","mc_cid","mc_eid","vero_id","s_cid","gad_source","gad_campaignid","adid","campaignid","term","_openstat","_hsenc","_hsmi","mkt_tok"]);
// Cross-site trackers safe to strip anywhere (LinkedIn lipi/lici/trk are page-instance & source trackers).
const SITE_TRACKING = new Set(["lipi","lici","trk","trkinfo","refid","midtoken","midsig","otptoken","originalreferer"]);

// Host-scoped params: removed ONLY on matching hosts, so we never touch params
// that are meaningful elsewhere (search query, video id, etc.).
const HOST_RULES = [
  {
    // Google Search & friends — keep q/hl/tbm/start/num, drop telemetry & UI state.
    test: (h) => /(^|\.)google\.[a-z.]+$/.test(h),
    params: ["oq","gs_lcrp","gs_lp","gs_ssp","sourceid","source","ved","ei","sca_esv","uact","iflsig","aqs","rlz","sxsrf","biw","bih","dpr","sclient","ie"],
  },
  {
    // YouTube — keep v (video) and t (timestamp), drop share/session cruft.
    test: (h) => /(^|\.)youtube\.com$/.test(h) || h === "youtu.be",
    params: ["si","pp","feature","ab_channel"],
  },
  {
    // Amazon — the product ASIN lives in the path (/dp/…), so query is all cruft.
    test: (h) => /(^|\.)amazon\.[a-z.]+$/.test(h),
    params: ["qid","sr","sprefix","crid","ref_","content-id","dib","dib_tag","th","psc","pd_rd_r","pd_rd_w","pd_rd_wg","pf_rd_p","pf_rd_r","pf_rd_s","pf_rd_t","pf_rd_i"],
  },
];

function hostParamsFor(host) {
  for (const rule of HOST_RULES) {
    if (rule.test(host)) return new Set(rule.params);
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
export function cleanUrl(original, settings) {
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

  const hostParams = settings.removeRef ? hostParamsFor(u.hostname.toLowerCase()) : null;

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
      // mc_* keys, cross-site trackers, and host-scoped params (e.g. Google telemetry).
      if (REF_TRACKING.has(k) || SITE_TRACKING.has(k) || k.startsWith("mc_") || (hostParams && hostParams.has(k))) {
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
