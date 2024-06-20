import { Link, useLocation } from "react-router-dom";
import classnames from "classnames";
import { Icon } from "../icons/icon";
import { Text } from "../atoms/typography/typography";
import styles from "./sidebar.module.scss";

type Item = { label: string; icon: string; path: string };

const items: Item[] = [
  { label: "Dashboard", icon: "home", path: "/" },
  { label: "Investments", icon: "file-invoice-dollar", path: "/investments" },
  { label: "About", icon: "info-circle", path: "/about" },
];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.logo}>
        <Icon icon="chart-pie" size="lg" />
      </div>
      <ul>
        {items.map((item) => (
          <li
            key={item.label}
            className={classnames(styles.item, {
              [styles["item-active"]]: item.path === pathname,
            })}
          >
            <Link to={item.path}>
              <Icon icon={item.icon} size="sm" />
              <Text size="lg">{item.label}</Text>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
