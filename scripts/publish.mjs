// Uploads the built zip to the Chrome Web Store via the official API.
//
//   npm run publish:store            upload only, leaves the draft unpublished
//   npm run publish:store -- --publish   upload and submit for review
//
// Credentials come from the environment and are never stored in this repo:
//   CWS_CLIENT_ID, CWS_CLIENT_SECRET, CWS_REFRESH_TOKEN, CWS_ITEM_ID
//
// One-time setup is documented in scripts/README.md.

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const doPublish = process.argv.includes("--publish");

const env = ["CWS_CLIENT_ID", "CWS_CLIENT_SECRET", "CWS_REFRESH_TOKEN", "CWS_ITEM_ID"];
const missing = env.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`missing environment variables: ${missing.join(", ")}\nSee scripts/README.md.`);
  process.exit(1);
}
const { CWS_CLIENT_ID, CWS_CLIENT_SECRET, CWS_REFRESH_TOKEN, CWS_ITEM_ID } = process.env;

const dist = join(root, "dist");
if (!existsSync(dist)) {
  console.error("no dist/ directory - run `npm run build` first.");
  process.exit(1);
}
const zipName = readdirSync(dist).find((f) => f.endsWith(".zip"));
if (!zipName) {
  console.error("no zip in dist/ - run `npm run build` first.");
  process.exit(1);
}
const zip = readFileSync(join(dist, zipName));

async function accessToken() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CWS_CLIENT_ID,
      client_secret: CWS_CLIENT_SECRET,
      refresh_token: CWS_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`token refresh failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

const token = await accessToken();
const auth = { Authorization: `Bearer ${token}`, "x-goog-api-version": "2" };

console.log(`uploading ${zipName} to item ${CWS_ITEM_ID} ...`);
const up = await fetch(
  `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${CWS_ITEM_ID}`,
  { method: "PUT", headers: auth, body: zip }
);
const upData = await up.json();
if (!up.ok || upData.uploadState === "FAILURE") {
  console.error(`upload failed: ${JSON.stringify(upData, null, 2)}`);
  process.exit(1);
}
console.log(`upload state: ${upData.uploadState}`);

if (!doPublish) {
  console.log("\nDraft uploaded. It is NOT submitted for review.");
  console.log("Review it in the dashboard, then run: npm run publish:store -- --publish");
  process.exit(0);
}

console.log("submitting for review ...");
const pub = await fetch(
  `https://www.googleapis.com/chromewebstore/v1.1/items/${CWS_ITEM_ID}/publish`,
  { method: "POST", headers: { ...auth, "Content-Length": "0" } }
);
const pubData = await pub.json();
if (!pub.ok) {
  console.error(`publish failed: ${JSON.stringify(pubData, null, 2)}`);
  process.exit(1);
}
console.log(`publish status: ${JSON.stringify(pubData.status)}`);
