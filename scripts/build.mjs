// Builds the Chrome Web Store zip.
// Run: npm run build   ->   dist/clean-url-v<version>.zip
//
// The package contents are an ALLOWLIST, not an ignore list: anything not named
// here never reaches the store, so repo-only material (tests, build scripts,
// design-system sources, notes) cannot leak into a published package.

import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync, existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const SHIP = [
  "manifest.json",
  "cleaner.js",
  "rules.json",
  "service_worker.js",
  "popup.html",
  "popup.js",
  "popup.css",
  "icons",
  "_locales",
  "tokens",
];

const version = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8")).version;
const stage = join(root, "dist", "pkg");
const out = join(root, "dist", `clean-url-v${version}.zip`);

rmSync(join(root, "dist"), { recursive: true, force: true });
mkdirSync(stage, { recursive: true });

for (const item of SHIP) {
  const src = join(root, item);
  if (!existsSync(src)) {
    console.error(`missing required file: ${item}`);
    process.exit(1);
  }
  cpSync(src, join(stage, item), { recursive: true });
}

// Strip macOS cruft that would otherwise be flagged by the store.
execFileSync("find", [stage, "-name", ".DS_Store", "-delete"]);

execFileSync("zip", ["-r", "-q", "-X", out, "."], { cwd: stage });
rmSync(stage, { recursive: true, force: true });

console.log(`built ${out} (${(statSync(out).size / 1024).toFixed(1)} KB, version ${version})`);
