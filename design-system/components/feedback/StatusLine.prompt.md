**StatusLine** — the polite live-region message below the buttons. Reserves 18px height even when empty so the layout never jumps.

```jsx
<StatusLine kind="success">Copied clean URL</StatusLine>
<StatusLine kind="error">Fail-safe: using original URL</StatusLine>
<StatusLine>{/* neutral / empty */}</StatusLine>
```

- `kind`: `"neutral" | "success" | "error"` → muted / mint / red.
