import List from "../../../../components/list/list";
import styles from "./top-lists.module.scss";
import useReturns from "../../../../queries/useReturns";
import { TopListItem, TopListItemLoader } from "./top-list-item";

type TopListsProps = {};

export default function TopLists({}: TopListsProps) {
  const { isPending, error, data: returns } = useReturns();

  if (isPending) {
    return (
      <div className={styles.lists}>
        {new Array(2).fill(undefined).map((e, i) => (
          <List
            isLoading
            key={i}
            label=""
            items={new Array(5).fill(<TopListItemLoader />)}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <h3>Something went wrong!</h3>;
  }

  const sortedReturns = returns.symbols.sort(
    (a, b) => b.oneDayReturns - a.oneDayReturns
  );
  const topWinners = sortedReturns.slice(0, 5);
  const topLosers = sortedReturns.slice(-5);

  return (
    <div className={styles.lists}>
      <List
        label="Top winners"
        items={topWinners.map((tw) => (
          <TopListItem
            key={tw.symbol}
            title={tw.symbol}
            oneDayReturns={tw.oneDayReturns}
            currency={tw.currency}
            qty={tw.quantity}
            change={tw.oneDayReturnsPercent}
          />
        ))}
      />
      <List
        label="Top losers"
        items={topLosers.reverse().map((tw) => (
          <TopListItem
            key={tw.symbol}
            title={tw.symbol}
            oneDayReturns={tw.oneDayReturns}
            currency={tw.currency}
            qty={tw.quantity}
            change={tw.oneDayReturnsPercent}
          />
        ))}
      />
    </div>
  );
}
