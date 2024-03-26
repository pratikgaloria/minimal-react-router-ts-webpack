import Button from "../../components/atoms/button/button";
import { Text } from "../../components/atoms/typography/typography";
import Stats from "../../components/stats/stats";
import TopLists from "./components/top-lists/top-lists";
import styles from "./dashboard.module.scss";

export default function Dashboard() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <Text size="lg">Dashboard</Text>
        <div className={styles.actions}>
          <Button>Today</Button>
          <Button variant="outlined">All time</Button>
        </div>
      </div>
      <Stats />
      <TopLists />
    </div>
  );
}
