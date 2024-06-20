import React from "react";
import classnames from "classnames";
import styles from "./input.module.scss";
import type { FieldApi } from "@tanstack/react-form";
import { Text } from "../atoms/typography/typography";

export type FormInputProps = {
  field: FieldApi<any, any, any, any, any>;
  label?: string;
  width?: number | string;
};

export function FormInput({ field, label, width }: FormInputProps) {
  const { errors } = field.getMeta();
  const hasErrors = errors.length > 0;

  return (
    <div className={classnames(styles.wrapper, { [styles.error]: hasErrors })}>
      <label htmlFor={field.name}>
        <Text size="md">{label}</Text>
      </label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        style={{ width }}
      />
      {hasErrors &&
        errors.map((e) => (
          <Text size="sm" key={e?.toString()}>
            {e?.toString()}
          </Text>
        ))}
    </div>
  );
}
