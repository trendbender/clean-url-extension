// Node test harness for the URL cleaner.
// Run: node test/clean.test.mjs
//
// cleanUrl is deliberately synchronous and takes its rules as an argument, so
// the core is testable here without any browser API.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { compileRules, cleanUrl, DEFAULT_SETTINGS } from "../cleaner.js";

const here = dirname(fileURLToPath(import.meta.url));
const rules = compileRules(JSON.parse(readFileSync(join(here, "..", "rules.json"), "utf8")));

let pass = 0;
const failures = [];

// `gone` = params that must disappear. `kept` = params that must survive.
function check(label, url, { gone = [], kept = [] }) {
  const out = cleanUrl(url, DEFAULT_SETTINGS, rules);
  const params = new URL(out.clean).searchParams;
  const problems = [];
  for (const p of gone) if (params.has(p)) problems.push(`"${p}" should be stripped but survived`);
  for (const p of kept) if (!params.has(p)) problems.push(`"${p}" must be kept but was stripped`);
  if (!out.safe) problems.push("fail-safe triggered");
  if (problems.length) failures.push(`${label}\n    ${url}\n    ${problems.join("\n    ")}`);
  else pass++;
}

// ── Regressions: existing behaviour must not change ─────────────────────────
check("utm + gclid are global", "https://example.com/a?utm_source=x&utm_medium=y&gclid=123&keep=1",
  { gone: ["utm_source", "utm_medium", "gclid"], kept: ["keep"] });
check("Google keeps the query, drops telemetry", "https://www.google.com/search?q=test&ved=2ab&ei=xyz&sca_esv=9",
  { gone: ["ved", "ei", "sca_esv"], kept: ["q"] });
check("YouTube keeps v and t", "https://www.youtube.com/watch?v=abc&t=42&si=trackme&feature=share",
  { gone: ["si", "feature"], kept: ["v", "t"] });
check("Amazon strips ref_ and psc", "https://www.amazon.de/dp/B01?ref_=x&psc=1&th=1",
  { gone: ["ref_", "psc", "th"] });
check("X strips the s/t share pair", "https://x.com/user/status/1?s=20&t=abc",
  { gone: ["s", "t"] });
check("bare ref survives globally (1.5.1 fix)", "https://shop.example.com/p?ref=friend-invite",
  { kept: ["ref"] });
check("Facebook still strips its host-scoped ref", "https://www.facebook.com/story?ref=share&mibextid=x",
  { gone: ["ref", "mibextid"] });

// ── New: Baidu Ads click id is global, like gclid ───────────────────────────
check("bd_vid is stripped on any host", "https://anysite.cn/landing?bd_vid=99887766&id=5",
  { gone: ["bd_vid"], kept: ["id"] });
check("isappinstalled (WeChat share) is global", "https://example.com/p?isappinstalled=0&x=1",
  { gone: ["isappinstalled"], kept: ["x"] });

// ── New: Chinese host rules ─────────────────────────────────────────────────
check("Taobao strips spm/scm/pvid, keeps id and skuId",
  "https://item.taobao.com/item.htm?id=654321&skuId=99&spm=a1z10.3&scm=1007.x&pvid=abc&acm=03",
  { gone: ["spm", "scm", "pvid", "acm"], kept: ["id", "skuId"] });
check("Taobao keeps the params two reviews flagged as functional",
  "https://s.taobao.com/search?q=shoes&price=10,50&scene=promo&activity_id=A7&spm=a1z10",
  { gone: ["spm"], kept: ["q", "price", "scene", "activity_id"] });
check("Bilibili strips share cruft, keeps p and t",
  "https://www.bilibili.com/video/BV1x?p=2&t=90&spm_id_from=333&vd_source=deadbeef&share_source=copy_web",
  { gone: ["spm_id_from", "vd_source", "share_source"], kept: ["p", "t"] });
check("Xiaohongshu strips share cruft, keeps xsec_token and type",
  "https://www.xiaohongshu.com/explore/65e?xsec_token=ABC123&type=video&xhsshare=CopyLink&appuid=5f&apptime=17",
  { gone: ["xhsshare", "appuid", "apptime"], kept: ["xsec_token", "type"] });
check("Weibo strips its navigation chain",
  "https://weibo.com/1234/ABCD?sudaref=google.com&wm=9006&luicode=10000011&lfid=1076",
  { gone: ["sudaref", "wm", "luicode", "lfid"] });

// ── Audit finding: parameter names must match case-insensitively ────────────
check("capitalised rule entries still match (sourceType, trackInfo)",
  "https://item.taobao.com/item.htm?id=1&sourceType=item&trackInfo=abc&utkn=zz",
  { gone: ["sourceType", "trackInfo", "utkn"], kept: ["id"] });

// ── Audit finding: service subdomains must be excluded ──────────────────────
check("space.bilibili.com keeps mid (it is the profile id)",
  "https://space.bilibili.com/?mid=123456",
  { kept: ["mid"] });
check("www.bilibili.com strips mid (it is the sharer id)",
  "https://www.bilibili.com/video/BV1x?mid=123456",
  { gone: ["mid"] });
check("api.weibo.com keeps the OAuth dialog params",
  "https://api.weibo.com/oauth2/authorize?client_id=1&display=mobile&wm=9006",
  { kept: ["display", "wm"] });
check("shop.taobao.com keeps user_number_id",
  "https://shop.taobao.com/shop/view_shop.htm?user_number_id=987654&spm=a1z10",
  { kept: ["user_number_id", "spm"] });

// ── neverStrip: destinations and access tokens ──────────────────────────────
check("redirect wrapper destination survives", "https://link.zhihu.com/?target=https%3A%2F%2Fexample.com",
  { kept: ["target"] });
check("weibo sinaurl destination survives", "https://weibo.cn/sinaurl?u=https%3A%2F%2Fexample.com&luicode=10000011",
  { gone: ["luicode"], kept: ["u"] });
check("OAuth code/state survive even with trackers present",
  "https://example.com/cb?code=AUTH&state=XYZ&utm_source=mail&fbclid=9",
  { gone: ["utm_source", "fbclid"], kept: ["code", "state"] });
check("WeChat article signature survives",
  "https://mp.weixin.qq.com/s?__biz=Mz1&mid=222&idx=1&sn=abcdef&utm_source=x",
  { gone: ["utm_source"], kept: ["__biz", "mid", "idx", "sn"] });

// ── Host matching must not be fooled by a lookalike domain ──────────────────
check("google.com.evil.io does not get Google's rules",
  "https://google.com.evil.io/search?q=x&ved=1&ei=2",
  { kept: ["ved", "ei", "q"] });

// ── Fail-safe ───────────────────────────────────────────────────────────────
const noRules = cleanUrl("https://example.com/?utm_source=x", DEFAULT_SETTINGS, null);
if (noRules.clean === "https://example.com/?utm_source=x" && noRules.safe === false) pass++;
else failures.push("missing rules must fail safe to the original URL");

const nonHttp = cleanUrl("chrome://settings", DEFAULT_SETTINGS, rules);
if (nonHttp.clean === "chrome://settings" && nonHttp.safe === true) pass++;
else failures.push("non-http URLs must pass through untouched");

// ── Report ──────────────────────────────────────────────────────────────────
console.log(`rules ${rules.rulesVersion} | ${pass} passed, ${failures.length} failed`);
if (failures.length) {
  console.log("\nFAILURES:\n" + failures.map((f) => "  - " + f).join("\n\n"));
  process.exit(1);
}
