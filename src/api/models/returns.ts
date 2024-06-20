import { TInvestment } from "./investments";

export type TReturnsSymbol = TInvestment & {
  investmentValue: number;
  currentValue: number;
  totalReturns: number;
  totalReturnsPercent: number;
  oneDayReturns: number;
  oneDayReturnsPercent: number;
};

export type TReturns = {
  oneDayReturns: number;
  totalReturns: number;
  symbols: TReturnsSymbol[];
};
