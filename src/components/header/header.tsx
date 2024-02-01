import { Link } from "react-router-dom";
import styles from "./header.module.scss";

export default function Header() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.logo}>Hello!</div>
      <nav>
        <ul>
          <li>
            <Link to="/">App</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/404">Not found!</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
