import { useQuery } from "@tanstack/react-query";

export type TInvestment = {
  _id: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  currency: string;
};

export type TReturnsSymbol = TInvestment & {
  investmentValue: number;
  currentValue: number;
  totalReturns: number;
  oneDayReturns: number;
  oneDayReturnsPercent: number;
};

export type TReturns = {
  oneDayReturns: number;
  totalReturns: number;
  symbols: TReturnsSymbol[];
};

export default function () {
  return useQuery<TReturns, Error>({
    queryKey: ["returns"],
    queryFn: () => fetch("/api/returns").then((response) => response.json()),
  });
}
