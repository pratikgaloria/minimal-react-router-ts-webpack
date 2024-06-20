import { Text } from "../atoms/typography/typography";
import styles from "./header.module.scss";

type HeaderProps = {
  label: string;
}

export function Header({ label, children }: React.PropsWithChildren<HeaderProps>) {
  return (
    <div className={styles.wrapper}>
      <Text size="xl">{label}</Text>
      <div className={styles.actions}>
        {children}
      </div>
    </div>
  );
}
