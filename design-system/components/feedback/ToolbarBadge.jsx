import React from "react";

/**
 * Toolbar badge — the green pill (with ✓) drawn over the browser-action icon
 * after a successful context-menu copy.
 */
export function ToolbarBadge({ text = "✓", style, ...rest }) {
  const badge = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "16px",
    height: "16px",
    padding: "0 4px",
    borderRadius: "999px",
    background: "var(--badge)",
    color: "var(--on-primary)",
    fontFamily: "var(--font)",
    fontSize: "11px",
    fontWeight: "var(--fw-button)",
    lineHeight: 1,
    boxShadow: "0 1px 3px rgba(0,0,0,.4)",
  };
  return (
    <span style={{ ...badge, ...style }} {...rest}>
      {text}
    </span>
  );
}
