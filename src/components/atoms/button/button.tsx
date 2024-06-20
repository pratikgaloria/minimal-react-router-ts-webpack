import classnames from "classnames";
import styles from "./button.module.scss";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: "primary" | "outlined" | "link" | "onlyIcon";
  size?: "sm" | "md" | "lg";
  fluid?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  red?: boolean;
};

export function Button({
  variant = "primary",
  size = "sm",
  fluid,
  isLoading,
  loadingText,
  red,
  children,
  ...buttonProps
}: React.PropsWithChildren<ButtonProps>) {
  return (
    <button
      {...buttonProps}
      className={classnames(
        styles.button,
        styles[`button-${size}`],
        styles[`button-${variant}`],
        red && styles.red,
        { [styles[`button-fluid`]]: fluid }
      )}
      disabled={isLoading}
    >
      {isLoading ? loadingText ?? "Please wait..." : children}
    </button>
  );
}
