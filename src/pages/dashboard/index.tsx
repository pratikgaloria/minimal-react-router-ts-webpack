import { Button } from "../../components/atoms/button/button";
import { Header } from "../../components/header/header";
import Stats from "../../components/stats/stats";
import TopLists from "./components/top-lists/top-lists";
import styles from "./dashboard.module.scss";

export default function Dashboard() {
  return (
    <div className={styles.wrapper}>
      <Header label="Dashboard">
        <Button>Today</Button>
        <Button variant="outlined">All time</Button>
      </Header>
      <Stats />
      <TopLists />
    </div>
  );
}
