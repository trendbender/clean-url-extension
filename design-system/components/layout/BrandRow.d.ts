import * as React from "react";

/**
 * The popup header: app icon (image or gradient "CU" fallback) + title + subtitle.
 */
export interface BrandRowProps {
  title?: string;
  subtitle?: string;
  /** Optional logo image URL. Omit to render the gradient "CU" monogram. */
  logoSrc?: string;
  style?: React.CSSProperties;
}

export function BrandRow(props: BrandRowProps): JSX.Element;
