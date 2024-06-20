import React, { useState } from "react";
import { FormApi } from "@tanstack/react-form";
import {
  deleteInvestmentMutation,
  updateInvestmentMutation,
} from "../../../api/mutations/useInvestments";
import { Alert, AlertType } from "../../../components/atoms/alerts/alerts";
import { FormData, InvestmentForm } from "./form";
import { TReturnsSymbol } from "../../../api/models/returns";

type Alert = {
  title: string;
  message?: string;
  type: AlertType;
};

type UpdateInvestmentProps = {
  symbolData: TReturnsSymbol;
  navigateNext: () => void;
};

export function UpdateInvestment({ symbolData, navigateNext }: UpdateInvestmentProps) {
  const { mutate: updateInvestment } = updateInvestmentMutation();
  const { mutate: deleteInvestment } = deleteInvestmentMutation();
  const [alert, setAlert] = useState<Alert | undefined>(undefined);

  const onUpdate = (value: FormData, formApi: FormApi<FormData, any>) => {
    updateInvestment(
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
            title: "Invenstment was updated succesfully!",
            message: `${value.symbol} x${value.quantity} ${value.averagePrice}`,
            type: "success",
          });
          navigateNext();
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
  };

  const onDelete = () => {
    deleteInvestment(symbolData.symbol,
      {
        onSuccess: () => {
          setAlert({
            title: "Invenstment was deleted succesfully!",
            message: symbolData.symbol,
            type: "warning",
          });
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
    <InvestmentForm
      data={{
        symbol: symbolData.symbol,
        quantity: symbolData.quantity.toString(),
        averagePrice: symbolData.averagePrice.toString(),
        tvSymbol: symbolData.tvSymbol,
      }}
      onSubmit={onUpdate}
      alert={alert}
      onAlertClose={() => setAlert(undefined)}
      allowDelete
      onDelete={onDelete}
    />
  );
}
