**UrlField** — a labelled, read-only multiline field for showing a URL. Text breaks on any character so long links wrap inside the field; focusing it selects the text and shows the blue ring (user copies with ⌘C as a clipboard fallback).

```jsx
<UrlField label="Original URL" value="https://example.com/?utm_source=x" />
<UrlField label="Clean URL" value="https://example.com/" />
```

- Always `readOnly`; `rows` controls height (default 2).
