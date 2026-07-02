import * as React from "react";

/**
 * Primary (gradient) and ghost (translucent) buttons for the Clean URL popup.
 */
export interface ButtonProps {
  /** Visual style. */
  variant?: "primary" | "ghost";
  /** Button label / contents. */
  children?: React.ReactNode;
  /** Disabled state (45% opacity, no interaction). */
  disabled?: boolean;
  /** Fill the container width. Ghost buttons in a row use fullWidth + flex:1. Default true. */
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
