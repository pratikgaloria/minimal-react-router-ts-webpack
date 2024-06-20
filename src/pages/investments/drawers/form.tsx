import { useState } from "react";
import { FormApi, useForm } from "@tanstack/react-form";
import { yupValidator } from "@tanstack/yup-form-adapter";
import * as yup from "yup";
import { Text } from "../../../components/atoms/typography/typography";
import { Button } from "../../../components/atoms/button/button";
import { FormInput } from "../../../components/forms/input";
import { Alert, AlertType } from "../../../components/atoms/alerts/alerts";
import styles from "./form.module.scss";

export type Alert = {
  title: string;
  message?: string;
  type: AlertType;
};

export type FormData = {
  symbol: string;
  quantity: string;
  averagePrice: string;
  tvSymbol: string;
};

type InvestmentFormProps = {
  data?: FormData;
  onSubmit: (data: FormData, form: FormApi<FormData, any>) => void;
  alert?: Alert;
  onAlertClose?: () => void;
  isLoading?: boolean;
  allowDelete?: boolean;
  onDelete?: () => void;
};

export function InvestmentForm({
  data,
  onSubmit,
  alert,
  onAlertClose,
  isLoading,
  allowDelete,
  onDelete,
}: InvestmentFormProps) {
  const [deleting, setDeleting] = useState(false);

  const form = useForm({
    defaultValues: data ?? {
      symbol: "",
      quantity: "",
      averagePrice: "",
      tvSymbol: "",
    },
    onSubmit: async ({ value, formApi }) => {
      onSubmit(value, formApi);
    },
    validatorAdapter: yupValidator,
  });

  return (
    <form
      className={styles.wrapper}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className={styles.form}>
        <form.Field
          name="symbol"
          validators={{
            onSubmit: yup.string().required("Symbol is required."),
          }}
          children={(field) => <FormInput field={field} label="Symbol" />}
        />
        <form.Field
          name="quantity"
          validators={{
            onSubmit: yup.string().required("Quantity is required."),
          }}
          children={(field) => <FormInput field={field} label="Quantity" />}
        />
        <form.Field
          name="averagePrice"
          validators={{
            onSubmit: yup.string().required("Average Price is required."),
          }}
          children={(field) => (
            <FormInput field={field} label="Average Price" />
          )}
        />
        <form.Field
          name="tvSymbol"
          validators={{
            onSubmit: yup.string().required("TV Symbol is required."),
          }}
          children={(field) => <FormInput field={field} label="TV Symbol" />}
        />
      </div>
      <div className={styles.cta}>
        {alert && onAlertClose && (
          <Alert
            variant={alert.type}
            title={alert.title}
            onClose={onAlertClose}
          >
            {alert.message}
          </Alert>
        )}
        {allowDelete && !deleting && (
          <Button
            type="button"
            variant="link"
            onClick={() => setDeleting(true)}
          >
            <Text className={styles.delete}>Delete this investment</Text>
          </Button>
        )}
        {deleting && (
          <div className={styles.deleting}>
            <Text className={styles.delete}>Are you sure?</Text>
            <Button type="button" variant="link" onClick={onDelete}>
              <Text className={styles.delete}>Yes</Text>
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setDeleting(false)}
            >
              <Text className={styles.delete}>No</Text>
            </Button>
          </div>
        )}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              isLoading={isSubmitting || isLoading}
              loadingText="Saving..."
              type="submit"
              disabled={!canSubmit}
              size="lg"
              fluid
            >
              Save
            </Button>
          )}
        />
      </div>
    </form>
  );
}
