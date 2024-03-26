import classnames from "classnames";
import { Text } from "../atoms/typography/typography";
import styles from "./stats.module.scss";
import useReturns from "../../queries/useReturns";

export type StatsItem = {
  label: string;
  value: number;
  change: number;
};

type StatsProps = {};

export default function Stats({}: StatsProps) {
  const { isPending, error, data: returns } = useReturns();

  if (isPending) {
    return (
      <div className={styles.wrapper}>
        {new Array(4).fill(undefined).map((e, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.label}>
              <Text isLoading />
              <Text isLoading />
            </div>
            <div className={styles.value}>
              <Text size="lg" isLoading />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <h3>Something went wrong!</h3>;
  }

  const items: StatsItem[] = [
    {
      label: "Global",
      change: returns.oneDayReturns,
      value: returns.totalReturns,
    },
    { label: "Overdue Invoices", change: -52.3, value: 12787.0 },
    { label: "Outstanding", change: 14.9, value: 877621.0 },
    { label: "Expenses", change: 77.2, value: 30156.0 },
  ];

  return (
    <div className={styles.wrapper}>
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          <div className={styles.label}>
            <Text>{item.label}</Text>
            <Text
              className={classnames(styles.change, {
                [styles.negative]: item.change < 0,
              })}
            >
              {item.change > 0 ? "+" : ""}
              {Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
              }).format(item.change)}
            </Text>
          </div>
          <div className={styles.value}>
            <Text size="lg">
              {Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
              }).format(item.value)}
            </Text>
          </div>
        </div>
      ))}
    </div>
  );
}
