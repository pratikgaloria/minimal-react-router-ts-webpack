import React, { useState } from "react";
import { FormApi } from "@tanstack/react-form";
import { createInvestmentMutation } from "../../../api/mutations/useInvestments";
import { Alert, AlertType } from "../../../components/atoms/alerts/alerts";
import { Drawer } from "../../../components/drawer/drawer";
import { FormData, InvestmentForm } from "./form";

type Alert = {
  title: string;
  message?: string;
  type: AlertType;
};

type AddNewInvestmentDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function AddNewInvestmentDrawer({
  open,
  onClose,
}: AddNewInvestmentDrawerProps) {
  const { mutate: createInvestment, isPending } = createInvestmentMutation();
  const [alert, setAlert] = useState<Alert | undefined>(undefined);

  const onAdd = (value: FormData, formApi: FormApi<FormData, any>) => {
    createInvestment(
      {
        investment: {
          symbol: value.symbol,
          quantity: Number(value.quantity),
          averagePrice: Number(value.averagePrice),
          currency: "USD",
          tvSymbol: value.tvSymbol,
        },
      },
      {
        onSuccess: () => {
          setAlert({
            title: "Invenstment was added succesfully!",
            message: `${value.symbol} x${value.quantity} ${value.averagePrice}`,
            type: "success",
          });
          formApi.reset();
        },
        onError: ({ response: error }) => {
          console.log(error);
          setAlert({
            title: "Something went wrong!",
            message: error?.data.message,
            type: "error",
          });
        },
      }
    );
  }

  return (
    <Drawer open={open} title="Add New Investment" onClose={onClose}>
      <InvestmentForm onSubmit={onAdd} alert={alert} onAlertClose={() => setAlert(undefined)} />
    </Drawer>
  );
}
