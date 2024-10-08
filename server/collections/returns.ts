import { Quote } from "yahoo-finance2/dist/esm/src/modules/quote";
import { Investments, TInvestment } from "./investments";
import { Quotes } from "./quotes";

export type TReturnsSymbol = TInvestment & {
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

export class Returns {
  static async get(): Promise<TReturns> {
    let oneDayReturns = 0;
    let totalReturns = 0;
    let totalFees = 0;
    const channels = await Investments.getReturns();

    Object.values(channels).forEach((channel) => {
      oneDayReturns += channel.oneDayReturns;
      totalReturns += channel.totalReturns;
      totalFees += channel.totalFees;
    });

    return {
      oneDayReturns,
      totalReturns,
      totalFees,
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
      quote.regularMarketPreviousClose = quote.regularMarketPreviousClose! / 1000;
    }
  
    const conversionRate = await Quotes.getConversion(
      investment.currency,
      quote.currency!
    );
  
    const investedValue = investment.averagePrice * investment.quantity;
    const currentValue =
      (quote.regularMarketPrice! / conversionRate) * investment.quantity;
    const totalReturns = currentValue - investedValue;
    const totalReturnsPercent = (100 * currentValue) / investedValue - 100;
    const previousValue =
      (quote.regularMarketPreviousClose! / conversionRate) * investment.quantity;
    const oneDayReturns = currentValue - previousValue;
    const oneDayReturnsPercent = (oneDayReturns * 100) / previousValue;
    const totalFees = investment.channel.fees;
  
    return {
      ...investment,
      investedValue,
      currentValue,
      totalReturns,
      totalReturnsPercent,
      oneDayReturns,
      oneDayReturnsPercent,
      totalFees,
    };
  };
}
