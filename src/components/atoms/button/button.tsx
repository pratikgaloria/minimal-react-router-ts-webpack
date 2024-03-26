import classnames from "classnames";
import styles from "./button.module.scss";

type ButtonProps = {
  variant?: "primary" | "outlined" | "link";
  size?: "sm" | "md" | "lg";
};

export default function Button({
  variant = "primary",
  size = "sm",
  children,
}: React.PropsWithChildren<ButtonProps>) {
  return <button className={classnames(styles.wrapper, styles[variant])}>{children}</button>;
}
