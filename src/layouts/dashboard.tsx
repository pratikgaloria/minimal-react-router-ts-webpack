import Header from "../components/header/header";
import { Sidebar } from "../components/sidebar/sidebar";
import styles from "./dashboard.module.scss";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className={styles.page}>
      <nav className={styles.sidebar}>
        <Sidebar />
      </nav>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  )
}