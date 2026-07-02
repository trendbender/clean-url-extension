**Toggle** — a cleaning-rule row: a native checkbox (accent-blue) plus a wrapping label inside a translucent pill. Whole pill is clickable; focus lights the border with the blue ring.

```jsx
<Toggle label="Remove UTM (utm_*)" checked onChange={(v) => set(v)} />
<Toggle label="Remove click IDs (gclid, fbclid, …)" checked={false} />
```

- The label wraps, so long localized strings grow the pill vertically instead of clipping.
- `checked` / `disabled` supported; `onChange(checked, event)`.
