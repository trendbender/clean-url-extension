**Card** — the translucent, blurred glass section container. Every block in the popup (URL fields, cleaning rules) sits in one.

```jsx
<Card>
  <UrlField label="Clean URL" value={clean} />
</Card>
```

- `backdrop-filter: blur(10px)` + `rgba(15,26,46,.72)` fill + hairline white border + soft drop shadow.
