import React from "react";

/**
 * Read-only URL field — a labelled, multiline read-only textarea with a blue focus ring.
 * Used for "Original URL" and "Clean URL".
 */
export function UrlField({
  label,
  value = "",
  rows = 2,
  id,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);

  const wrap = { display: "block", width: "100%" };

  const lbl = {
    display: "block",
    fontFamily: "var(--font)",
    fontSize: "var(--fs-small)",
    color: "var(--muted)",
    marginBottom: "6px",
  };

  const field = {
    boxSizing: "border-box",
    width: "100%",
    resize: "none",
    borderRadius: "var(--radius-input)",
    border: `1px solid ${focus ? "var(--focus-ring)" : "var(--field-border)"}`,
    background: "var(--field-fill)",
    color: "var(--text)",
    padding: "9px 10px",
    fontFamily: "var(--font)",
    fontSize: "var(--fs-small)",
    lineHeight: "var(--lh-body)",
    outline: "none",
    wordBreak: "break-all",
  };

  return (
    <label style={{ ...wrap, ...style }}>
      {label ? <span style={lbl}>{label}</span> : null}
      <textarea
        id={id}
        readOnly
        rows={rows}
        value={value}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={field}
        {...rest}
      />
    </label>
  );
}
