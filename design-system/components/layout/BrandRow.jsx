import React from "react";

/**
 * Brand row — app icon + title + subtitle. The popup header.
 */
export function BrandRow({
  title = "Clean URL",
  subtitle = "One-click link cleaner",
  logoSrc,
  style,
  ...rest
}) {
  const row = { display: "flex", gap: "10px", alignItems: "center" };

  const logo = {
    width: "34px",
    height: "34px",
    borderRadius: "var(--radius-logo)",
    boxShadow: "var(--shadow)",
    outline: "1px solid rgba(255,255,255,.28)",
    outlineOffset: "-1px",
    flex: "0 0 auto",
    display: "block",
  };

  const gradientLogo = {
    ...logo,
    background: "var(--grad-logo)",
    color: "var(--on-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font)",
    fontWeight: "var(--fw-button)",
    fontSize: "15px",
    letterSpacing: "-0.5px",
  };

  const titleStyle = {
    fontFamily: "var(--font)",
    fontSize: "var(--fs-title)",
    fontWeight: "var(--fw-title)",
    lineHeight: "var(--lh-title)",
    color: "var(--text)",
  };

  const subStyle = {
    fontFamily: "var(--font)",
    fontSize: "var(--fs-small)",
    color: "var(--muted)",
    marginTop: "2px",
  };

  return (
    <div style={{ ...row, ...style }} {...rest}>
      {logoSrc ? (
        <img src={logoSrc} alt={title} style={logo} />
      ) : (
        <div style={gradientLogo} aria-label={title}>CU</div>
      )}
      <div>
        <div style={titleStyle}>{title}</div>
        <div style={subStyle}>{subtitle}</div>
      </div>
    </div>
  );
}
