import classnames from "classnames";
import styles from "./tabs.module.scss";

export type TabVariant = "underlined" | "pill";
export type TabSize =  "sm" | "md" | "lg";

type TabProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: TabVariant;
  size?: TabSize;
  active?: boolean;
  disabled?: boolean;
};

export function Tab({
  variant = "underlined",
  size = "md",
  active,
  disabled,
  children,
  ...buttonProps
}: React.PropsWithChildren<TabProps>) {
  return (
    <button
      {...buttonProps}
      className={classnames(
        styles.tab,
        styles[`tab-${size}`],
        styles[`tab-${variant}`],
        active && styles['active']
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
