import classnames from "classnames";
import styles from "./stats-item.module.scss";
import { Text } from "../atoms/typography/typography";

type StatsItemProps = {
  label: string;
  value: number;
  change: number;
  logo?: string;
};

export function StatsItemLoading() {
  return (
    <div className={styles.statsItem}>
      <div className={styles.label}>
        <Text size="lg" isLoading />
        <Text isLoading loaderWidth={64} />
      </div>
      <div className={styles.value}>
        <Text size="xl" isLoading loaderWidth={144} />
      </div>
    </div>
  );
}

export default function StatsItem({
  label,
  value,
  change,
  logo,
}: StatsItemProps) {
  return (
    <div className={styles.statsItem}>
      <div className={styles.label}>
        <div className={styles.symbol}>
          <img loading="lazy" src={"/public/images/logos/" + logo + ".svg"} />
          <Text size="lg">{label}</Text>
        </div>
        <Text
          className={classnames(styles.change, {
            [styles.negative]: change < 0,
          })}
        >
          {change > 0 ? "+" : ""}
          {Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
          }).format(change)}
        </Text>
      </div>
      <div className={styles.value}>
        <Text size="xl">
          {Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
          }).format(value)}
        </Text>
      </div>
    </div>
  );
}
