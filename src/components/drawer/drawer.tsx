import React from "react";
import classnames from "classnames";
import styles from "./drawer.module.scss";
import { WithPortal } from "../portal/portal";
import { Text } from "../atoms/typography/typography";
import { Button } from "../atoms/button/button";
import { Icon } from "../icons/icon";

type DrawerProps = {
  open: boolean;
  title: string | JSX.Element;
  onClose: () => void;
  className?: string;
};

export function Drawer({
  open,
  title,
  onClose,
  children,
  className,
}: React.PropsWithChildren<DrawerProps>) {
  if (!open) {
    return null;
  }

  return (
    <WithPortal>
      <div className={classnames(styles.wrapper, className)}>
        <div className={styles.title}>
          {typeof title === "string" ? <Text size="xl">{title}</Text> : title}
          <Button variant="onlyIcon" onClick={onClose}>
            <Icon icon="times" size="sm" />
          </Button>
        </div>
        {children}
      </div>
    </WithPortal>
  );
}
