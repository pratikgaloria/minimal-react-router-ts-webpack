import classnames from "classnames";
import { themeSizes } from "../../../styles/theme/types";
import styles from "./typography.module.scss";
import ContentLoader from "react-content-loader";

const textLoaderHeights: Record<themeSizes, number> = {
  xs: 11,
  sm: 12,
  md: 15,
  lg: 17,
  xl: 26,
};

type TextProps = {
  size?: themeSizes;
  variant?: "normal" | "light" | "thick";
  className?: string;
  isLoading?: boolean;
  loaderWidth?: number;
};

export function Text({
  size = "md",
  variant = "normal",
  className,
  children,
  isLoading,
  loaderWidth,
}: React.PropsWithChildren<TextProps>) {
  if (isLoading) {
    return (
      <ContentLoader
        width={loaderWidth ?? 100}
        height={textLoaderHeights[size]}
      >
        <rect
          x="0"
          y="0"
          width={loaderWidth ?? 100}
          height={textLoaderHeights[size]}
        ></rect>
      </ContentLoader>
    );
  }

  return (
    <span
      className={classnames(
        styles[`text-${size}`],
        styles[`text-${variant}`],
        className
      )}
    >
      {children}
    </span>
  );
}
