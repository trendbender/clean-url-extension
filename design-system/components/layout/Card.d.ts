import * as React from "react";

/**
 * Translucent, blurred glass card — the popup's section container.
 */
export interface CardProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card(props: CardProps): JSX.Element;
