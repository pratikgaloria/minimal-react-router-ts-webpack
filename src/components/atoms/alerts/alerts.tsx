import classnames from "classnames";
import styles from "./alerts.module.scss";
import { Icon } from "../../icons/icon";
import { Text } from "../typography/typography";
import { Button } from "../button/button";

export type AlertType = "success" | "warning" | "error" | "info";

type AlertProps = {
  variant?: AlertType;
  size?: "sm" | "lg";
  title: string;
  fluid?: boolean;
  onClose: () => void;
};

export function Alert({
  variant = "success",
  size = "lg",
  fluid,
  title,
  onClose,
  children,
}: React.PropsWithChildren<AlertProps>) {
  let icon = "check-circle";
  switch (variant) {
    case "info":
      icon = "info-circle";
      break;
    case "warning":
      icon = "exclamation-circle";
      break;
    case "error":
      icon = "exclamation-triangle";
      break;
    default:
      icon = "check-circle";
      break;
  }

  return (
    <div
      className={classnames(
        styles.alert,
        styles[`alert-${size}`],
        styles[`alert-${variant}`],
        fluid && styles[`alert-fluid`]
      )}
    >
      <Icon icon={icon} />
      <div className={styles.message}>
        <Text variant="thick">{title}</Text>
        <Text size="sm">{children}</Text>
      </div>
      <Button type="button" variant="onlyIcon" onClick={onClose}>
        <Icon icon="times" />
      </Button>
    </div>
  );
}
