import * as React from "react";

/**
 * Read-only, labelled URL text field (multiline textarea) with a #5aa8ff focus ring.
 * Used for "Original URL" and "Clean URL".
 */
export interface UrlFieldProps {
  /** Field label above the input. */
  label?: React.ReactNode;
  /** The URL string to display (read-only). */
  value?: string;
  /** Visible rows. Default 2. */
  rows?: number;
  id?: string;
  style?: React.CSSProperties;
}

export function UrlField(props: UrlFieldProps): JSX.Element;
