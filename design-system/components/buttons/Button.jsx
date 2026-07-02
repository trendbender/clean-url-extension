import React from "react";

/**
 * Clean URL button.
 * variant: "primary" (blue→mint gradient, bold, near-black text) | "ghost" (translucent).
 * Ghost buttons sit in a 50/50 row; primary is full-width by default.
 */
export function Button({
  variant = "ghost",
  children,
  disabled = false,
  fullWidth = true,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const [focus, setFocus] = React.useState(false);

  const isPrimary = variant === "primary";

  const base = {
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: fullWidth ? "100%" : "auto",
    borderRadius: "var(--radius)",
    padding: "10px 12px",
    fontFamily: "var(--font)",
    fontSize: "var(--fs-body)",
    lineHeight: 1.1,
    cursor: disabled ? "not-allowed" : "pointer",
    outline: "none",
    transition:
      "transform var(--dur-press) var(--ease), border-color var(--dur-hover) var(--ease), background var(--dur-hover) var(--ease)",
    transform: active && !disabled ? "var(--press-translate)" : "none",
    opacity: disabled ? 0.45 : 1,
  };

  const skin = isPrimary
    ? {
        background: "var(--grad-primary)",
        border: "1px solid var(--btn-border-strong)",
        color: "var(--on-primary)",
        fontWeight: "var(--fw-button)",
      }
    : {
        background: "var(--ghost-fill)",
        border: `1px solid ${
          hover && !disabled ? "var(--btn-border-strong)" : "var(--btn-border)"
        }`,
        color: "var(--text)",
        fontWeight: "var(--fw-medium)",
      };

  const focusRing = focus && !disabled
    ? { boxShadow: "0 0 0 3px var(--focus-ring)" }
    : null;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{ ...base, ...skin, ...focusRing, ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}
