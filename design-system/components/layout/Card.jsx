import React from "react";

/**
 * Glass card / section container — translucent blurred fill, white hairline border.
 * The core building block of the popup body.
 */
export function Card({ children, style, ...rest }) {
  const card = {
    boxSizing: "border-box",
    background: "var(--card-glass)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "10px",
    boxShadow: "var(--shadow-card)",
    backdropFilter: "var(--blur)",
    WebkitBackdropFilter: "var(--blur)",
  };
  return (
    <section style={{ ...card, ...style }} {...rest}>
      {children}
    </section>
  );
}
