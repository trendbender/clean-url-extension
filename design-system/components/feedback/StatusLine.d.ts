import * as React from "react";

/**
 * Polite aria-live status message under the popup actions.
 * neutral = muted, success = mint (#7cf0c0), error = red (#ff6b6b).
 */
export interface StatusLineProps {
  children?: React.ReactNode;
  kind?: "neutral" | "success" | "error";
  style?: React.CSSProperties;
}

export function StatusLine(props: StatusLineProps): JSX.Element;
