**RemovedHint** — the "Removed N params" counter under the Clean URL field. Muted grey at 0; mint when at least one tracker was stripped.

```jsx
<RemovedHint count={5} />   {/* "Removed 5 params", mint */}
<RemovedHint count={0} />   {/* "Removed 0 params", muted */}
```

- In production the string is localized via the `removedParams` message; this renders English for mockups.
