import classnames from "classnames";
import { Text } from "../../../../components/atoms/typography/typography";
import styles from "./top-lists.module.scss";

type TopListItemProps = {
  title: string;
  qty: number;
  oneDayReturns: number;
  change: number;
  currency: string;
};

export function TopListItemLoader() {
  return (
    <div className={styles.item}>
      <div className={styles.logo}>
        <Text size="md" isLoading loaderWidth={20}></Text>
      </div>
      <div>
        <Text isLoading loaderWidth={72}></Text>
      </div>
      <div className={styles.quote}>
        <Text isLoading loaderWidth={48} />
      </div>
      <div className={styles.quote}>
        <Text isLoading loaderWidth={48} />
      </div>
    </div>
  );
}

export function TopListItem({
  title,
  qty,
  oneDayReturns,
  change,
  currency,
}: TopListItemProps) {
  return (
    <div className={styles.item}>
      <div className={styles.logo}>
        <img
          loading="lazy"
          // src="https://s3-symbol-logo.tradingview.com/sentinelone--big.svg"
          src={`https://cdn.jsdelivr.net/gh/ahmeterenodaci/New-York-Stock-Exchange--NYSE--including-Symbols-and-Logos@master/logos/_${title}.png`}
        />
      </div>
      <div>
        <Text>{title}</Text>
        <Text className={styles.quantity} size="sm">&nbsp;{qty.toFixed(1)}</Text>
      </div>
      <div
        className={classnames(styles.quote, { [styles.negative]: change < 0 })}
      >
        <Text>
          {Intl.NumberFormat("de-DE", { style: "currency", currency }).format(
            oneDayReturns
          )}
        </Text>
      </div>
      <div
        className={classnames(styles.quote, { [styles.negative]: change < 0 })}
      >
        <Text>{change.toFixed(1)}%</Text>
      </div>
    </div>
  );
}
