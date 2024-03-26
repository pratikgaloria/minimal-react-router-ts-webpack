import { Text } from "../atoms/typography/typography";
import styles from "./list.module.scss";

type ListProps = {
  items: JSX.Element[];
  label: string;
  isLoading?: boolean;
};

export default function List({ label, items, isLoading }: ListProps) {
  return (
    <div className={styles.wrapper}>
      <Text isLoading={isLoading} className={styles.label}>{label}</Text>
      <ul>
        {items.map((item) => (
          <li key={item.key}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
