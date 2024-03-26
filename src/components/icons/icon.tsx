import { themeSizes } from "../../styles/theme/types";
import classnames from "classnames";
import styles from "./icon.module.scss";

type IconProps = {
  icon: string;
  size?: themeSizes;
};

export default function Icon({ icon, size = "md" }: IconProps) {
  return (
    <i className={classnames("las", `la-${icon}`, styles[`icon-${size}`])}></i>
  );
}
