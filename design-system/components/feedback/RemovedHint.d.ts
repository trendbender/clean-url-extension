import * as React from "react";

/**
 * "Removed N params" hint under the Clean URL field. Muted at 0, mint when > 0.
 * Note: real copy comes from the i18n "removedParams" string; this component renders English.
 */
export interface RemovedHintProps {
  count?: number;
  style?: React.CSSProperties;
}

export function RemovedHint(props: RemovedHintProps): JSX.Element;
