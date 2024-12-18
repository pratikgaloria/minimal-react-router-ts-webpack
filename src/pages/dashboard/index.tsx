import { useState } from "react";
import { Header } from "../../components/header/header";
import Stats from "./components/stats/stats";
import TopLists from "./components/top-lists/top-lists";
import { Pills } from "../../components/atoms/pills/pills";
import styles from "./dashboard.module.scss";

export type DashboardState = "today" | "all-time";

export default function Dashboard() {
  const [state, setState] = useState<DashboardState>("today");

  return (
    <div className={styles.wrapper}>
      <Header label="Dashboard">
        <Pills
          items={[
            { id: "today", label: "Today" },
            { id: "all-time", label: "All time" },
          ]}
          size="sm"
          selectedItem={state}
          onSelect={(id) => setState(id as DashboardState)}
        />
      </Header>
      <Stats state={state} />
      <TopLists />
    </div>
  );
}
