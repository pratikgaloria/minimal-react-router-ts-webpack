import { Outlet } from "react-router-dom";
import styles from "./app.module.scss";
import Header from "./components/header/header";

export default function App() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Header />
      </div>
      <main className={styles.container}>
        <Outlet />
      </main>
    </div>
  );
}
