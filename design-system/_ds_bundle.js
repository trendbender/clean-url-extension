/* @ds-bundle: {"format":3,"namespace":"CleanURLDesignSystem_814f5d","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"RemovedHint","sourcePath":"components/feedback/RemovedHint.jsx"},{"name":"StatusLine","sourcePath":"components/feedback/StatusLine.jsx"},{"name":"ToolbarBadge","sourcePath":"components/feedback/ToolbarBadge.jsx"},{"name":"Toggle","sourcePath":"components/forms/Toggle.jsx"},{"name":"UrlField","sourcePath":"components/forms/UrlField.jsx"},{"name":"BrandRow","sourcePath":"components/layout/BrandRow.jsx"},{"name":"Card","sourcePath":"components/layout/Card.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"7d1f38ee641e","components/feedback/RemovedHint.jsx":"ef309e6bef18","components/feedback/StatusLine.jsx":"b82b448f7e4e","components/feedback/ToolbarBadge.jsx":"4a9a64b58072","components/forms/Toggle.jsx":"c0b03e127f84","components/forms/UrlField.jsx":"1deef9d17b86","components/layout/BrandRow.jsx":"e3e1aa8bea7a","components/layout/Card.jsx":"69e301fda518","ui_kits/popup/ContextMenu.jsx":"89cb0d70e689","ui_kits/popup/PopupScreen.jsx":"c90456b95e09"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CleanURLDesignSystem_814f5d = window.CleanURLDesignSystem_814f5d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Clean URL button.
 * variant: "primary" (blue→mint gradient, bold, near-black text) | "ghost" (translucent).
 * Ghost buttons sit in a 50/50 row; primary is full-width by default.
 */
function Button({
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
    transition: "transform var(--dur-press) var(--ease), border-color var(--dur-hover) var(--ease), background var(--dur-hover) var(--ease)",
    transform: active && !disabled ? "var(--press-translate)" : "none",
    opacity: disabled ? 0.45 : 1
  };
  const skin = isPrimary ? {
    background: "var(--grad-primary)",
    border: "1px solid var(--btn-border-strong)",
    color: "var(--on-primary)",
    fontWeight: "var(--fw-button)"
  } : {
    background: "var(--ghost-fill)",
    border: `1px solid ${hover && !disabled ? "var(--btn-border-strong)" : "var(--btn-border)"}`,
    color: "var(--text)",
    fontWeight: "var(--fw-medium)"
  };
  const focusRing = focus && !disabled ? {
    boxShadow: "0 0 0 3px var(--focus-ring)"
  } : null;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...base,
      ...skin,
      ...focusRing,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/feedback/RemovedHint.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * "Removed N params" hint shown beneath the Clean URL field.
 * Turns mint when count > 0 to reward a successful clean.
 */
function RemovedHint({
  count = 0,
  style,
  ...rest
}) {
  const highlight = count > 0;
  const base = {
    marginTop: "8px",
    fontFamily: "var(--font)",
    fontSize: "var(--fs-small)",
    color: highlight ? "var(--status-success)" : "var(--muted)"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      ...base,
      ...style
    }
  }, rest), "Removed ", count, " param", count === 1 ? "" : "s");
}
Object.assign(__ds_scope, { RemovedHint });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/RemovedHint.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusLine.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Status line — the aria-live message under the actions.
 * kind: "neutral" | "success" (mint) | "error" (red).
 */
function StatusLine({
  children,
  kind = "neutral",
  style,
  ...rest
}) {
  const color = kind === "success" ? "var(--status-success)" : kind === "error" ? "var(--status-error)" : "var(--status-neutral)";
  const base = {
    marginTop: "10px",
    minHeight: "18px",
    fontFamily: "var(--font)",
    fontSize: "var(--fs-small)",
    lineHeight: "var(--lh-body)",
    color
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    "aria-live": "polite",
    style: {
      ...base,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { StatusLine });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusLine.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ToolbarBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Toolbar badge — the green pill (with ✓) drawn over the browser-action icon
 * after a successful context-menu copy.
 */
function ToolbarBadge({
  text = "✓",
  style,
  ...rest
}) {
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
    boxShadow: "0 1px 3px rgba(0,0,0,.4)"
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...badge,
      ...style
    }
  }, rest), text);
}
Object.assign(__ds_scope, { ToolbarBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ToolbarBadge.jsx", error: String((e && e.message) || e) }); }

// components/forms/Toggle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Toggle row — a checkbox + label inside a translucent pill.
 * Tolerates long localized strings (label wraps; pill grows).
 */
function Toggle({
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
    border: `1px solid ${focus ? "var(--focus-ring)" : "var(--toggle-border)"}`,
    background: hover && !disabled ? "rgba(255,255,255,.05)" : "var(--toggle-fill)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "background var(--dur-hover) var(--ease), border-color var(--dur-hover) var(--ease)"
  };
  const box = {
    width: "16px",
    height: "16px",
    flex: "0 0 auto",
    accentColor: "var(--accent)",
    cursor: disabled ? "not-allowed" : "pointer",
    margin: 0
  };
  const text = {
    fontFamily: "var(--font)",
    fontSize: "var(--fs-toggle)",
    lineHeight: "var(--lh-body)",
    color: "var(--text)",
    textWrap: "pretty"
  };
  return /*#__PURE__*/React.createElement("label", _extends({
    style: {
      ...pill,
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked, e),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: box
  }), /*#__PURE__*/React.createElement("span", {
    style: text
  }, label));
}
Object.assign(__ds_scope, { Toggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Toggle.jsx", error: String((e && e.message) || e) }); }

// components/forms/UrlField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Read-only URL field — a labelled, multiline read-only textarea with a blue focus ring.
 * Used for "Original URL" and "Clean URL".
 */
function UrlField({
  label,
  value = "",
  rows = 2,
  id,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const wrap = {
    display: "block",
    width: "100%"
  };
  const lbl = {
    display: "block",
    fontFamily: "var(--font)",
    fontSize: "var(--fs-small)",
    color: "var(--muted)",
    marginBottom: "6px"
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
    wordBreak: "break-all"
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      ...wrap,
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: lbl
  }, label) : null, /*#__PURE__*/React.createElement("textarea", _extends({
    id: id,
    readOnly: true,
    rows: rows,
    value: value,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: field
  }, rest)));
}
Object.assign(__ds_scope, { UrlField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/UrlField.jsx", error: String((e && e.message) || e) }); }

// components/layout/BrandRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Brand row — app icon + title + subtitle. The popup header.
 */
function BrandRow({
  title = "Clean URL",
  subtitle = "One-click link cleaner",
  logoSrc,
  style,
  ...rest
}) {
  const row = {
    display: "flex",
    gap: "10px",
    alignItems: "center"
  };
  const logo = {
    width: "34px",
    height: "34px",
    borderRadius: "var(--radius-logo)",
    boxShadow: "var(--shadow)",
    outline: "1px solid rgba(255,255,255,.28)",
    outlineOffset: "-1px",
    flex: "0 0 auto",
    display: "block"
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
    letterSpacing: "-0.5px"
  };
  const titleStyle = {
    fontFamily: "var(--font)",
    fontSize: "var(--fs-title)",
    fontWeight: "var(--fw-title)",
    lineHeight: "var(--lh-title)",
    color: "var(--text)"
  };
  const subStyle = {
    fontFamily: "var(--font)",
    fontSize: "var(--fs-small)",
    color: "var(--muted)",
    marginTop: "2px"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      ...row,
      ...style
    }
  }, rest), logoSrc ? /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: title,
    style: logo
  }) : /*#__PURE__*/React.createElement("div", {
    style: gradientLogo,
    "aria-label": title
  }, "CU"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: titleStyle
  }, title), /*#__PURE__*/React.createElement("div", {
    style: subStyle
  }, subtitle)));
}
Object.assign(__ds_scope, { BrandRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/BrandRow.jsx", error: String((e && e.message) || e) }); }

// components/layout/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Glass card / section container — translucent blurred fill, white hairline border.
 * The core building block of the popup body.
 */
function Card({
  children,
  style,
  ...rest
}) {
  const card = {
    boxSizing: "border-box",
    background: "var(--card-glass)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "10px",
    boxShadow: "var(--shadow-card)",
    backdropFilter: "var(--blur)",
    WebkitBackdropFilter: "var(--blur)"
  };
  return /*#__PURE__*/React.createElement("section", _extends({
    style: {
      ...card,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); }

// ui_kits/popup/ContextMenu.jsx
try { (() => {
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
    fontSize: "13px"
  };
  const item = active => ({
    padding: "7px 14px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: active ? "rgba(90,168,255,.22)" : "transparent",
    cursor: "default"
  });
  const div = {
    height: "1px",
    background: "rgba(255,255,255,.08)",
    margin: "6px 0"
  };
  const muted = {
    color: "#97a7c8"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: menu
  }, /*#__PURE__*/React.createElement("div", {
    style: item(false)
  }, /*#__PURE__*/React.createElement("span", {
    style: muted
  }, "Back")), /*#__PURE__*/React.createElement("div", {
    style: item(false)
  }, /*#__PURE__*/React.createElement("span", {
    style: muted
  }, "Reload")), /*#__PURE__*/React.createElement("div", {
    style: div
  }), /*#__PURE__*/React.createElement("div", {
    style: item(true)
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-cu.svg",
    width: "16",
    height: "16",
    alt: "",
    style: {
      borderRadius: "4px"
    }
  }), /*#__PURE__*/React.createElement("span", null, "Copy Clean URL (page)")), /*#__PURE__*/React.createElement("div", {
    style: item(false)
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-cu.svg",
    width: "16",
    height: "16",
    alt: "",
    style: {
      borderRadius: "4px"
    }
  }), /*#__PURE__*/React.createElement("span", null, "Copy Clean URL (link)")), /*#__PURE__*/React.createElement("div", {
    style: div
  }), /*#__PURE__*/React.createElement("div", {
    style: item(false)
  }, /*#__PURE__*/React.createElement("span", {
    style: muted
  }, "Inspect")));
}
window.ContextMenu = ContextMenu;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/popup/ContextMenu.jsx", error: String((e && e.message) || e) }); }

// ui_kits/popup/PopupScreen.jsx
try { (() => {
/* global React */
/**
 * The assembled Clean URL popup — the full 360px browser-action surface,
 * composed entirely from design-system components.
 *
 * Loaded via Babel in index.html; reads DS components from the global namespace
 * and exposes itself as window.PopupScreen.
 *
 * scenario: "empty" | "cleaned" | "copied"
 */
function PopupScreen({
  scenario = "cleaned",
  logoSrc = "../../assets/logo-cu.svg"
}) {
  const {
    BrandRow,
    Card,
    UrlField,
    Toggle,
    Button,
    RemovedHint,
    StatusLine
  } = window.CleanURLDesignSystem_814f5d;
  const DIRTY = "https://example.com/article?utm_source=newsletter&utm_medium=email&utm_campaign=spring&gclid=Cj0KxAryZ&fbclid=IwAR2x";
  const CLEAN = "https://example.com/article";
  const isEmpty = scenario === "empty";
  const original = isEmpty ? "" : DIRTY;
  const clean = isEmpty ? "" : CLEAN;
  const removed = isEmpty ? 0 : 5;
  const [rules, setRules] = React.useState({
    utm: true,
    click: true,
    ref: true,
    frag: true
  });
  const [status, setStatus] = React.useState(scenario === "copied" ? {
    kind: "success",
    msg: "Copied clean URL"
  } : {
    kind: "neutral",
    msg: ""
  });
  const set = k => v => setRules(r => ({
    ...r,
    [k]: v
  }));
  const shell = {
    width: "360px",
    background: "var(--backdrop)",
    color: "var(--text)",
    fontFamily: "var(--font)",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: shell
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      padding: "14px 14px 10px"
    }
  }, /*#__PURE__*/React.createElement(BrandRow, {
    logoSrc: logoSrc
  })), /*#__PURE__*/React.createElement("main", {
    style: {
      padding: "0 14px 14px"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React.createElement(UrlField, {
    label: "Original URL",
    value: original
  })), /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React.createElement(UrlField, {
    label: "Clean URL",
    value: clean
  }), /*#__PURE__*/React.createElement(RemovedHint, {
    count: removed
  })), /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "13px",
      fontWeight: 650,
      marginBottom: "8px"
    }
  }, "Cleaning rules"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    }
  }, /*#__PURE__*/React.createElement(Toggle, {
    label: "Remove UTM (utm_*)",
    checked: rules.utm,
    onChange: set("utm")
  }), /*#__PURE__*/React.createElement(Toggle, {
    label: "Remove click IDs (gclid, fbclid, \u2026)",
    checked: rules.click,
    onChange: set("click")
  }), /*#__PURE__*/React.createElement(Toggle, {
    label: "Remove ref/tracking (ref, igshid, mc_*, \u2026)",
    checked: rules.ref,
    onChange: set("ref")
  }), /*#__PURE__*/React.createElement(Toggle, {
    label: "Remove text fragments (#:~:text=)",
    checked: rules.frag,
    onChange: set("frag")
  }))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    disabled: isEmpty,
    onClick: () => setStatus({
      kind: "success",
      msg: "Copied clean URL"
    })
  }, "Copy Clean"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      marginTop: "8px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    disabled: isEmpty,
    onClick: () => setStatus({
      kind: "success",
      msg: "Copied original URL"
    })
  }, "Copy Original"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    disabled: isEmpty
  }, "Open Clean")), /*#__PURE__*/React.createElement(StatusLine, {
    kind: status.kind
  }, status.msg))));
}
window.PopupScreen = PopupScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/popup/PopupScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.RemovedHint = __ds_scope.RemovedHint;

__ds_ns.StatusLine = __ds_scope.StatusLine;

__ds_ns.ToolbarBadge = __ds_scope.ToolbarBadge;

__ds_ns.Toggle = __ds_scope.Toggle;

__ds_ns.UrlField = __ds_scope.UrlField;

__ds_ns.BrandRow = __ds_scope.BrandRow;

__ds_ns.Card = __ds_scope.Card;

})();
