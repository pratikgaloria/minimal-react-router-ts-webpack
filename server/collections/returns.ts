import { Quote } from "yahoo-finance2/dist/esm/src/modules/quote";
import { Investments, TInvestment } from "./investments";
import { Quotes } from "./quotes";

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

export class Returns {
  static async get(): Promise<TReturns> {
    let oneDayReturns = 0;
    let totalReturns = 0;
    let currentValue = 0;
    let otherImpact = 0;
    let pl = 0;
    const channels = await Investments.getReturns();

    Object.values(channels).forEach((channel) => {
      oneDayReturns += channel.oneDayReturns;
      totalReturns += channel.totalReturns;
      currentValue += channel.currentValue;
      otherImpact += channel.otherImpact;
      pl += channel.pl;
    });

    return {
      oneDayReturns,
      totalReturns,
      currentValue,
      otherImpact,
      pl,
      channels,
    };
  }

  static async calculate(
    investment: TInvestment,
    quote: Quote
  ): Promise<TInvestment & TReturnsSymbol> {
    if (quote.currency === "GBp") {
      quote.currency = "GBP";
      quote.regularMarketPrice = quote.regularMarketPrice! / 1000;
      quote.regularMarketPreviousClose =
        quote.regularMarketPreviousClose! / 1000;
    }

    const conversionRate = await Quotes.getConversion(
      investment.currency,
      quote.currency!
    );

    const otherImpact = investment.channel.fxImpact;
    const investedValue = investment.averagePrice * investment.quantity;
    const currentValue =
    (quote.regularMarketPrice! / conversionRate) * investment.quantity;
    const totalReturns = currentValue - investedValue;
    const totalReturnsPercent = (100 * currentValue) / investedValue - 100;
    const previousValue =
      (quote.regularMarketPreviousClose! / conversionRate) *
      investment.quantity;
    const oneDayReturns = currentValue - previousValue;
    const oneDayReturnsPercent = (oneDayReturns * 100) / previousValue;
    const pl = totalReturns + otherImpact;

    return {
      ...investment,
      displayName: quote.shortName ?? quote.displayName ?? "",
      investedValue,
      currentValue,
      totalReturns,
      totalReturnsPercent,
      oneDayReturns,
      oneDayReturnsPercent,
      otherImpact,
      pl,
    };
  }
}
