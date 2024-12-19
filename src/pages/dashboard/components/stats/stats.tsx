import styles from "./stats.module.scss";
import useReturns from "../../../../api/queries/useReturns";
import StatsItem, {
  StatsItemLoading,
} from "../../../../components/stats/stats-item";
import { DashboardState } from "../..";

export type StatsItem = {
  label: string;
  value: number;
  change: number;
  logo?: string;
};

type StatsProps = {
  state: DashboardState;
};

export default function Stats({ state }: StatsProps) {
  const { isPending, error, data: returns } = useReturns();

  if (isPending) {
    return (
      <div className={styles.wrapper}>
        {new Array(4).fill(undefined).map((e, i) => (
          <StatsItemLoading />
        ))}
      </div>
    );
  }

  if (error) {
    return <h3>Something went wrong!</h3>;
  }

  const items: StatsItem[] = [
    {
      label: "Total",
      change: state === "today" ? returns.oneDayReturns : returns.pl,
      value: state === "today" ? returns.pl : returns.currentValue,
      logo: "market-all",
    },
    {
      label: "Global",
      change:
        state === "today"
          ? returns.channels["trading212"].oneDayReturns
          : returns.channels["trading212"].pl,
      value:
        state === "today"
          ? returns.channels["trading212"].pl
          : returns.channels["trading212"].currentValue,
      logo: "market-global",
    },
    {
      label: "India",
      change:
        state === "today"
          ? returns.channels["india"].oneDayReturns +
            returns.channels["kuvera"].oneDayReturns
          : returns.channels["india"].pl + returns.channels["kuvera"].pl,
      value:
        state === "today"
          ? returns.channels["india"].pl + returns.channels["kuvera"].pl
          : returns.channels["india"].currentValue +
            returns.channels["kuvera"].currentValue,
      logo: "market-india",
    },
    {
      label: "Crypto",
      change:
        state === "today"
          ? returns.channels["crypto"].oneDayReturns
          : returns.channels["crypto"].pl,
      value:
        state === "today"
          ? returns.channels["crypto"].pl
          : returns.channels["crypto"].currentValue,
      logo: "market-crypto",
    },
  ];

  return (
    <div className={styles.wrapper}>
      {items.map((item) => (
        <StatsItem {...item} />
      ))}
    </div>
  );
}
