**Button** — primary (blue→mint gradient) and ghost (translucent) buttons for the 360px popup. Use `primary` for the single main action ("Copy Clean"), `ghost` for secondary actions.

```jsx
<Button variant="primary">Copy Clean</Button>
<div style={{ display: "flex", gap: 8 }}>
  <Button variant="ghost">Copy Original</Button>
  <Button variant="ghost">Open Clean</Button>
</div>
```

- `variant`: `"primary" | "ghost"` — primary is full-width & bold; ghost pairs 50/50 in a flex row.
- States are automatic: hover brightens the border, active nudges down 1px, focus shows a `#5aa8ff` ring, `disabled` drops to 45% opacity.
