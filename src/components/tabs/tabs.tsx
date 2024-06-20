import React from "react";
import { Tab, TabSize, TabVariant } from "./tab";

type TabsProps = {
  value: number;
  onChange: (activeTabIndex: number) => void;
  variant?: TabVariant;
  size?: TabSize;
  className?: string;
};

export const Tabs = ({
  value,
  onChange,
  variant,
  size,
  className,
  children,
}: React.PropsWithChildren<TabsProps>) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div key={index} onClick={() => onChange(index)}>
          <Tab variant={variant} size={size} active={index === value}>
            {child}
          </Tab>
        </div>
      ))}
    </div>
  );
};
