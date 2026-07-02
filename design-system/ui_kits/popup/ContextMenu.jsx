/* global React */
/**
 * The right-click context-menu item the extension registers on pages & links.
 * A cosmetic recreation of Chrome's menu chrome for the design system.
 * Loaded via Babel; exposed as window.ContextMenu.
 */
function ContextMenu() {
  const menu = {
    width: "260px",
    background: "#2b2b2f",
    border: "1px solid rgba(255,255,255,.10)",
    borderRadius: "8px",
    padding: "6px 0",
    boxShadow: "0 12px 34px rgba(0,0,0,.5)",
    fontFamily: "var(--font)",
    color: "#e9eefc",
    fontSize: "13px",
  };
  const item = (active) => ({
    padding: "7px 14px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: active ? "rgba(90,168,255,.22)" : "transparent",
    cursor: "default",
  });
  const div = { height: "1px", background: "rgba(255,255,255,.08)", margin: "6px 0" };
  const muted = { color: "#97a7c8" };

  return (
    <div style={menu}>
      <div style={item(false)}><span style={muted}>Back</span></div>
      <div style={item(false)}><span style={muted}>Reload</span></div>
      <div style={div}></div>
      <div style={item(true)}>
        <img src="../../assets/logo-cu.svg" width="16" height="16" alt="" style={{ borderRadius: "4px" }} />
        <span>Copy Clean URL (page)</span>
      </div>
      <div style={item(false)}>
        <img src="../../assets/logo-cu.svg" width="16" height="16" alt="" style={{ borderRadius: "4px" }} />
        <span>Copy Clean URL (link)</span>
      </div>
      <div style={div}></div>
      <div style={item(false)}><span style={muted}>Inspect</span></div>
    </div>
  );
}

window.ContextMenu = ContextMenu;
