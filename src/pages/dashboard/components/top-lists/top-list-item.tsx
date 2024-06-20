import classnames from "classnames";
import { Text } from "../../../../components/atoms/typography/typography";
import styles from "./top-lists.module.scss";
import { Currency } from "../../../../components/atoms/currency/currency";

type TopListItemProps = {
  title: string;
  oneDayReturns: number;
  change: number;
  currency: string;
};

export function TopListItemLoader() {
  return (
    <div className={styles.item}>
      <div className={styles.title}>
        <Text isLoading loaderWidth={20}></Text>
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
  oneDayReturns,
  change,
  currency,
}: TopListItemProps) {
  return (
    <div className={styles.item}>
      <div className={styles.title}>
        <img loading="lazy" src={"/public/images/logos/" + title + ".svg"} />
        <Text>{title}</Text>
      </div>
      <div
        className={classnames(styles.quote, { [styles.negative]: change < 0 })}
      >
        <Text>
          <Currency currency={currency}>{oneDayReturns}</Currency>
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
