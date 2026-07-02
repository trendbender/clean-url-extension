// Shared URL-cleaning logic used by both the popup and the service worker.
// Keeping it in one module prevents the two entry points from drifting apart.
//
// Design rule: a param is only added to a GLOBAL set if it has no legitimate
// function anywhere (pure ad/analytics identifiers). Anything that could be
// meaningful on some site (search query, sort, share tokens like `s`/`t`) is
// scoped to the hosts where it is known to be tracking (HOST_RULES).

export const DEFAULT_SETTINGS = {
  removeUtm: true,
  removeClickIds: true,
  removeRef: true,
  removeTextFragment: true,
};

// ── Campaign tags ───────────────────────────────────────────────────────────
// Governed by removeUtm. utm_* plus its analytics-suite equivalents.
const CAMPAIGN_PREFIXES = ["utm_"];

// ── Advertising click identifiers ───────────────────────────────────────────
// Governed by removeClickIds. Opaque per-click IDs — no function beyond tracking.
const CLICK_IDS = new Set([
  "gclid","gclsrc","gbraid","wbraid","dclid",   // Google Ads
  "fbclid",                                       // Meta
  "msclkid",                                      // Microsoft / Bing Ads
  "ttclid",                                       // TikTok Ads
  "twclid",                                       // Twitter / X Ads
  "yclid",                                        // Yandex
  "srsltid",                                      // Google Shopping / Merchant
  "igshid",                                       // Instagram share
  "epik",                                         // Pinterest
  "cjevent",                                      // Commission Junction
  "irclickid",                                    // Impact Radius
  "rb_clickid",                                   // Russian ad networks
  "s_kwcid",                                      // Adobe / Google keyword click
  "gps_adid",                                     // Google Play
  "wickedid",                                     // Wicked Reports
  "li_fat_id",                                    // LinkedIn Ads
  "_branch_match_id",                             // Branch.io
  "vero_id",                                      // Vero email
]);

// ── General cross-site trackers ─────────────────────────────────────────────
// Governed by removeRef. Safe to strip on any host.
const REF_TRACKING = new Set([
  "ref","ref_src","referrer",
  "gad_source","gad_campaignid","adid","campaignid",
  "mc_cid","mc_eid",                              // Mailchimp
  "s_cid","sc_cid","icid",                        // Adobe / Oracle
  "_openstat",                                    // Openstat / Yandex
  "_hsenc","_hsmi","__hssc","__hstc","__hsfp","hsctatracking", // HubSpot
  "mkt_tok",                                      // Marketo
  "elqtrack","elqtrackid",                        // Eloqua
  "oly_anon_id","oly_enc_id",                     // Olytics
  "vero_conv",                                    // Vero
]);

// Analytics-namespace prefixes (governed by removeRef).
const TRACKING_PREFIXES = ["mc_","pk_","mtm_","matomo_","piwik_","hsa_"];

// ── Cross-site trackers safe to strip anywhere ──────────────────────────────
// LinkedIn lipi/lici/trk are page-instance & source trackers.
const SITE_TRACKING = new Set(["lipi","lici","trk","trkinfo","refid","midtoken","midsig","otptoken","originalreferer"]);

// ── Host-scoped params ──────────────────────────────────────────────────────
// Removed ONLY on matching hosts, so we never touch params that are meaningful
// elsewhere (search query, video id, share tokens like s/t/si).
const HOST_RULES = [
  {
    // Google Search & co. — keep q/hl/tbm/start/num, drop telemetry & UI state.
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
  {
    // AliExpress / Alibaba — product id in path; query is tracking/session.
    test: (h) => /(^|\.)aliexpress\.[a-z.]+$/.test(h) || /(^|\.)alibaba\.com$/.test(h),
    params: ["spm","scm","scm-url","pvid","_t","aff_platform","aff_trace_key","terminal_id","sk","algo_pvid","algo_expid","btsid","ws_ab_test","gatewayadapt","pdp_ext_f","pdp_npi","sourcetype","utparam"],
  },
  {
    // Twitter / X — s and t are share trackers.
    test: (h) => /(^|\.)twitter\.com$/.test(h) || /(^|\.)x\.com$/.test(h),
    params: ["s","t","ref_src","ref_url"],
  },
  {
    // TikTok — keep the video id in the path.
    test: (h) => /(^|\.)tiktok\.com$/.test(h),
    params: ["is_from_webapp","sender_device","web_id","_r","_t"],
  },
  {
    // Spotify — si is a share/attribution token.
    test: (h) => /(^|\.)spotify\.com$/.test(h),
    params: ["si","nd","context"],
  },
  {
    // Reddit — keep the permalink path.
    test: (h) => /(^|\.)reddit\.com$/.test(h),
    params: ["share_id","correlation_id","ref_campaign","ref_source","rdt","%24deep_link","%243p"],
  },
  {
    // eBay — item id in path; query is marketing tracking.
    test: (h) => /(^|\.)ebay\.[a-z.]+$/.test(h),
    params: ["_trkparms","_trksid","hash","mkevt","mkcid","mkrid","campid","toolid","customid"],
  },
  {
    // Facebook — keep the story/post path.
    test: (h) => /(^|\.)facebook\.com$/.test(h),
    params: ["mibextid","comment_tracking","notif_t","notif_id","__tn__","__cft__[0]","ref"],
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

    if (settings.removeUtm && CAMPAIGN_PREFIXES.some((p) => k.startsWith(p))) {
      toDelete.push(key);
      continue;
    }
    if (settings.removeClickIds && CLICK_IDS.has(k)) {
      toDelete.push(key);
      continue;
    }
    if (settings.removeRef) {
      if (
        REF_TRACKING.has(k) ||
        SITE_TRACKING.has(k) ||
        (hostParams && hostParams.has(k)) ||
        TRACKING_PREFIXES.some((p) => k.startsWith(p))
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
