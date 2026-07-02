import React from "react";

/**
 * Toggle row — a checkbox + label inside a translucent pill.
 * Tolerates long localized strings (label wraps; pill grows).
 */
export function Toggle({
  label,
  checked = false,
  disabled = false,
  onChange,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);

  const pill = {
    boxSizing: "border-box",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    padding: "8px 6px",
    borderRadius: "var(--radius-input)",
    border: `1px solid ${
      focus ? "var(--focus-ring)" : "var(--toggle-border)"
    }`,
    background: hover && !disabled
      ? "rgba(255,255,255,.05)"
      : "var(--toggle-fill)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "background var(--dur-hover) var(--ease), border-color var(--dur-hover) var(--ease)",
  };

  const box = {
    width: "16px",
    height: "16px",
    flex: "0 0 auto",
    accentColor: "var(--accent)",
    cursor: disabled ? "not-allowed" : "pointer",
    margin: 0,
  };

  const text = {
    fontFamily: "var(--font)",
    fontSize: "var(--fs-toggle)",
    lineHeight: "var(--lh-body)",
    color: "var(--text)",
    textWrap: "pretty",
  };

  return (
    <label
      style={{ ...pill, ...style }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...rest}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.checked, e)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={box}
      />
      <span style={text}>{label}</span>
    </label>
  );
}
