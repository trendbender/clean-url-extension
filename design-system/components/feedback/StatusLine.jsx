import React from "react";

/**
 * Status line — the aria-live message under the actions.
 * kind: "neutral" | "success" (mint) | "error" (red).
 */
export function StatusLine({ children, kind = "neutral", style, ...rest }) {
  const color =
    kind === "success"
      ? "var(--status-success)"
      : kind === "error"
      ? "var(--status-error)"
      : "var(--status-neutral)";

  const base = {
    marginTop: "10px",
    minHeight: "18px",
    fontFamily: "var(--font)",
    fontSize: "var(--fs-small)",
    lineHeight: "var(--lh-body)",
    color,
  };

  return (
    <div role="status" aria-live="polite" style={{ ...base, ...style }} {...rest}>
      {children}
    </div>
  );
}
