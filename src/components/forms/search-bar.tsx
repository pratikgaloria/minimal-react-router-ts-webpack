import React, { useState, useRef } from "react";
import classnames from "classnames";
import styles from "./search-bar.module.scss";
import { Icon } from "../icons/icon";
import { Button } from "../atoms/button/button";

export type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
};

export function SearchBar({
  value: initialValue,
  onChange,
  debounce = 500,
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  React.useEffect(() => {
    if (expanded) {
      inputRef.current?.focus();
    }
  }, [expanded]);

  return (
    <div className={classnames(styles.wrapper, expanded && styles.expanded)}>
      <Button size="sm" variant="onlyIcon" onClick={() => setExpanded(!expanded)}>
        <Icon size="xs" icon="search" />
      </Button>
      {expanded && <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search..."
        type="text"
      />}
    </div>
  );
}
