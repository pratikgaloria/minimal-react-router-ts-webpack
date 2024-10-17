import React from "react";
import classnames from "classnames";
import styles from "./pills.module.scss";
import { Text } from "../typography/typography";

type Pill = {
  id: string;
  label: string;
  logo?: string;
};

type PillsProps = {
  items: Pill[];
  selectedItem?: string;
  size?: "sm" | "md";
  onSelect: (id: string) => void;
};

export const Pills = ({
  items,
  size = "md",
  selectedItem,
  onSelect,
}: PillsProps) => {
  return (
    <div className={styles.pills}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={classnames(
            styles.pill,
            styles[`pill-${size}`],
            selectedItem === item.id ? styles.active : ""
          )}
        >
          {item.logo && (
            <img
              loading="lazy"
              src={"/public/images/logos/" + item.logo + ".svg"}
            />
          )}
          <Text size={size}>{item.label}</Text>
        </button>
      ))}
    </div>
  );
};
