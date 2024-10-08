import classnames from "classnames";
import { Text } from "../atoms/typography/typography";
import styles from "./stats.module.scss";
import useReturns from "../../api/queries/useReturns";

export type StatsItem = {
  label: string;
  value: number;
  change: number;
  logo?: string;
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
              <Text size="lg" isLoading />
              <Text isLoading loaderWidth={64} />
            </div>
            <div className={styles.value}>
              <Text size="xl" isLoading loaderWidth={144} />
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
      change: returns.channels['trading212'].oneDayReturns,
      value: returns.channels['trading212'].totalReturns,
      logo: "market-global",
    },
    { label: "India", change: -52.3, value: 12787.0, logo: "market-india" },
    { label: "Crypto", change: 14.9, value: 877621.0, logo: "market-crypto" },
    { label: "ETFs", change: 77.2, value: 30156.0, logo: "market-etfs" },
  ];

  return (
    <div className={styles.wrapper}>
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          <div className={styles.label}>
            <div className={styles.symbol}>
              <img
                loading="lazy"
                src={"/public/images/logos/" + item.logo + ".svg"}
              />
              <Text size="lg">{item.label}</Text>
            </div>
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
            <Text size="xl">
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
