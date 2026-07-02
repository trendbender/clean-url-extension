import * as React from "react";

/**
 * The green (#22c55e) toolbar badge shown over the extension icon after a
 * successful "Copy Clean URL" from the context menu. Default glyph is a ✓.
 */
export interface ToolbarBadgeProps {
  /** Badge text — "✓" on success, "!" on failure. */
  text?: string;
  style?: React.CSSProperties;
}

export function ToolbarBadge(props: ToolbarBadgeProps): JSX.Element;
