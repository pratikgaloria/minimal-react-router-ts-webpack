import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MutatedInvestment,
  InvestmentRequestError,
  InvestmentRequestParams,
} from "../models/investments";

export function createInvestmentMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    MutatedInvestment,
    AxiosError<InvestmentRequestError>,
    InvestmentRequestParams
  >({
    mutationFn: (newInvestment: InvestmentRequestParams) => {
      return axios.post("/api/investments", newInvestment);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["returns"] });
    },
  });
}

export function updateInvestmentMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    MutatedInvestment,
    AxiosError<InvestmentRequestError>,
    InvestmentRequestParams
  >({
    mutationFn: (updatedInvestment: InvestmentRequestParams) => {
      const { symbol, ...updatedValues } = updatedInvestment.investment;

      return axios.put(
        `/api/investments/${updatedInvestment.investment.symbol}`,
        updatedValues
      );
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["returns"] });
    },
  });
}

export function deleteInvestmentMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    MutatedInvestment,
    AxiosError<InvestmentRequestError>,
    string
  >({
    mutationFn: (symbol: string) => {
      return axios.delete(`/api/investments/${symbol}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["returns"] });
    },
  });
}
