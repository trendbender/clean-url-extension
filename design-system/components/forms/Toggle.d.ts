import * as React from "react";

/**
 * A cleaning-rule toggle: checkbox + label inside a translucent pill.
 * Label wraps to tolerate long German/Russian strings.
 */
export interface ToggleProps {
  /** Row label, e.g. "Remove UTM (utm_*)". */
  label: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}

export function Toggle(props: ToggleProps): JSX.Element;
