import { AxiosResponse } from "axios";

export type TInvestment = {
  _id: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  currency: string;
  tvSymbol: string;
};

export type InvestmentRequestParams = {
  investment: Omit<TInvestment, "_id">;
};
export type InvestmentRequestError = {
  success: boolean;
  message: string;
  errorCode: number;
};

export type MutatedInvestment = AxiosResponse<{ success: boolean; data?: TInvestment; }>;
