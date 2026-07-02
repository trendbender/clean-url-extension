import React from "react";

/**
 * "Removed N params" hint shown beneath the Clean URL field.
 * Turns mint when count > 0 to reward a successful clean.
 */
export function RemovedHint({ count = 0, style, ...rest }) {
  const highlight = count > 0;
  const base = {
    marginTop: "8px",
    fontFamily: "var(--font)",
    fontSize: "var(--fs-small)",
    color: highlight ? "var(--status-success)" : "var(--muted)",
  };
  return (
    <div style={{ ...base, ...style }} {...rest}>
      Removed {count} param{count === 1 ? "" : "s"}
    </div>
  );
}
