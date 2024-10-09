import React from "react";
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
  onSelect: (id: string) => void;
};

export const Pills = ({ items, selectedItem, onSelect }: PillsProps) => {
  return (
    <div className={styles.pills}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={item.id === selectedItem ? styles.active : ""}
        >
          {item.logo && (
            <img
              loading="lazy"
              src={"/public/images/logos/" + item.logo + ".svg"}
            />
          )}
          <Text size="md">{item.label}</Text>
        </button>
      ))}
    </div>
  );
};
