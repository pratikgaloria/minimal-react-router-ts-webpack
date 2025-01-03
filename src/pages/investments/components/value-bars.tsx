import React from "react";
import classnames from "classnames";
import styles from "./value-bars.module.scss";

type ValueBarsProps = {
  returns: number;
};

export function ValueBars({ returns }: ValueBarsProps) {
  return (
    <div className={styles.valueBars}>
      <div className={styles.bar} style={{ width: "25px" }}></div>
      <div
        className={classnames(styles.bar, styles.returnsBar, { [styles.negative]: returns < 0 })}
        style={{ width: `${25 + (25 * returns) / 100}px` }}
      ></div>
    </div>
  );
}
