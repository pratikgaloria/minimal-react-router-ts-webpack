import { Text } from "../atoms/typography/typography";
import styles from "./list.module.scss";

type ListProps = {
  items: JSX.Element[];
  label: string;
  isLoading?: boolean;
};

export function List({ label, items, isLoading }: ListProps) {
  return (
    <div className={styles.wrapper}>
      <Text size="lg" isLoading={isLoading} className={styles.label}>
        {label}
      </Text>
      <ul>
        {items.map((item, i) => (
          <li key={isLoading ? i : item.key}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
