# Clean URL

Clean URL is a lightweight Chrome extension that removes tracking parameters from URLs in one click.

It helps you quickly clean links by removing UTM tags, click IDs, and other common tracking parameters before sharing.

## Features

- Remove UTM parameters (`utm_*`)
- Remove click IDs (`gclid`, `fbclid`, etc.)
- Remove 50+ known ad / analytics parameters (`srsltid`, `igshid`, `mkt_tok`, HubSpot, Matomo, …)
- Site-specific cleanup (LinkedIn, Google, YouTube, Amazon, AliExpress, X/Twitter, TikTok, Spotify, Reddit, eBay, Facebook)
- Strip text-fragment directives (`#:~:text=`)
- One-click clean & copy
- Available in 7 languages (English, Русский, Español, Deutsch, Français, Português BR, 简体中文)
- Works fully offline
- No tracking, no analytics, no data collection

## Design system

The full design system (tokens, components, guidelines, icon) lives in [`design-system/`](design-system/). The extension consumes its tokens directly from [`tokens/`](tokens/).

## Privacy

Clean URL does not collect, store, or transmit any user data.

All processing is done locally in the browser.  
No external services, servers, or third-party APIs are used.

Privacy policy:  
https://raw.githubusercontent.com/trendbender/clean-url-extension/main/privacy.md

## Support

If you have questions or suggestions, please open an issue:  
https://github.com/trendbender/clean-url-extension/issues
