import { useState } from "react";
import { Text } from "../components/atoms/typography/typography";
import { Tabs } from "../components/tabs";
import styles from "./about.module.scss";

export default function About() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <Text size="lg">About</Text>
      <div>
        <Tabs variant="pill" className={styles.tabs} value={activeTab} onChange={setActiveTab}>
          <div>Box</div>
          <div>Span</div>
          <div>Tab</div>
        </Tabs>
      </div>
    </div>
  );
}
