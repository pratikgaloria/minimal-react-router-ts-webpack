import { TInvestment } from "./investments";

export type TReturnsSymbol = TInvestment & {
  displayName: string;
  investedValue: number;
  currentValue: number;
  totalReturns: number;
  totalReturnsPercent: number;
  oneDayReturns: number;
  oneDayReturnsPercent: number;
  otherImpact: number;
  pl: number;
};

export type TReturnsChannel = {
  oneDayReturns: number;
  totalReturns: number;
  currentValue: number;
  otherImpact: number;
  pl: number;
  symbols: TReturnsSymbol[];
};

export type TReturnsChannels = Record<string, TReturnsChannel>;

export type TReturns = {
  oneDayReturns: number;
  totalReturns: number;
  currentValue: number;
  otherImpact: number;
  pl: number;
  channels: TReturnsChannels;
};
