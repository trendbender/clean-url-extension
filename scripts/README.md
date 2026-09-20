# Build and publish

```bash
npm test          # 26 cases: regressions, host rules, fail-safes
npm run build     # -> dist/clean-url-v<version>.zip
```

## Where the rules live

All parameter names are in [`../rules.json`](../rules.json); [`../cleaner.js`](../cleaner.js)
holds only logic. Adding a tracker is a data change: edit the JSON, add a case to
`test/clean.test.mjs`, run `npm test`.

Two invariants the engine enforces so that a bad rule cannot do damage:

- **`neverStrip` always wins.** Destination parameters (`target`, `u`, `url`, `pfurl`),
  access tokens (`code`, `state`, `xsec_token`, `sn`) and core identifiers (`id`, `q`,
  `wd`, `skuid`) are never removed, whatever another list says.
- **Names are lowercased on load.** The matcher lowercases the name it reads from the
  URL, so an entry written as `sourceType` would otherwise never match and would fail
  silently. `compileRules()` normalises instead of trusting the file.

`excludeHosts` keeps a rule off service subdomains, where the same name means something
else: `mid` is a sharer id on `www.bilibili.com` but the profile id on
`space.bilibili.com`.

## Publishing to the Chrome Web Store

Uses the official Chrome Web Store API, so no clicking through the dashboard.

```bash
npm run build
npm run publish:store              # uploads a draft, does NOT submit
npm run publish:store -- --publish # uploads and submits for review
```

The default is upload-only on purpose: publishing is public and hard to walk back, so
it takes an explicit flag.

### One-time setup

1. In Google Cloud Console, create an OAuth client of type **Desktop app** and enable
   the **Chrome Web Store API** for the project.
2. Get a refresh token for that client with the scope
   `https://www.googleapis.com/auth/chromewebstore`, authorising as the Google account
   that owns the extension listing.
3. Put the four values in the environment before running the script:

   | Variable | What it is |
   |---|---|
   | `CWS_CLIENT_ID` | OAuth client id |
   | `CWS_CLIENT_SECRET` | OAuth client secret |
   | `CWS_REFRESH_TOKEN` | refresh token from step 2 |
   | `CWS_ITEM_ID` | the extension's Web Store item id |

**Never commit these values.** Keep them in a local `.env` (git-ignored) or a password
manager and export them for the run. The repository stores only the variable names.

## Remote rules: deliberately not implemented

`rules.json` is shaped as a wire format and `loadRules()` already parses it through the
path a remote feed would use, but the extension only ever reads its own packaged copy.
Fetching rules from the network was considered and rejected for now:

- the published privacy policy states the extension contacts no external servers, and a
  periodic fetch would leak user IP and usage cadence to the host;
- it needs a new host permission, which disables the extension for existing users until
  they re-approve it;
- it turns the rules host into a live control channel into every user's browser.

If it is ever added: keep it data-only (no regular expressions), ship the packaged
rules as the offline baseline, verify a signature against a public key baked into the
extension, gate it behind `optional_host_permissions` and an explicit opt-in, and keep
`neverStrip` in code where a remote file cannot reach it.
