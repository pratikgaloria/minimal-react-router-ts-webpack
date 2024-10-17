import { TInvestment } from "./investments";

export type TReturnsSymbol = TInvestment & {
  displayName: string;
  investedValue: number;
  currentValue: number;
  totalReturns: number;
  totalReturnsPercent: number;
  oneDayReturns: number;
  oneDayReturnsPercent: number;
  totalFees: number;
};

export type TReturnsChannel = {
  oneDayReturns: number;
  totalReturns: number;
  totalFees: number;
  symbols: TReturnsSymbol[];
};

export type TReturnsChannels = Record<string, TReturnsChannel>;

export type TReturns = {
  oneDayReturns: number;
  totalReturns: number;
  totalFees: number;
  channels: TReturnsChannels;
};
