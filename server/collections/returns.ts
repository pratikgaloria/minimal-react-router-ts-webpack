import { Quotes } from "../utils/quotes";
import { db } from "../db";
import { TInvestment } from "./investments";
import { Quote } from "yahoo-finance2/dist/esm/src/modules/quote";

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

export class Returns {
  constructor() {}

  async getAll() {
    const investments = await db.investments.getAll();
    const symbols = investments.map((i) => i.symbol);
    await fetchConversions(investments);

    const quotes = await Quotes.get(symbols);

    const allReturns: TReturnsSymbol[] = [];

    let oneDayReturns = 0;
    let totalReturns = 0;
    for (const investment of investments) {
      const quote = quotes[investment.symbol];
      const returns = await calculateReturns(investment, quote);

      const toEUR = await Quotes.getConversion(investment.currency, "EUR");
      oneDayReturns += returns.oneDayReturns * toEUR;
      totalReturns += returns.totalReturns * toEUR;
      allReturns.push(returns);
    }
    
    return {
      oneDayReturns,
      totalReturns,
      symbols: allReturns,
    };
  }
}

const fetchConversions = async (investments: TInvestment[]) => {
  /*
  const currencies = new Set(
    investments.map((i) => (i.currency === "GBp" ? "GBP" : i.currency))
  );
  const keys = Array.from(currencies.keys()).reduce<string[]>((keys, c) => {
    if (c === "USD") return [...keys, "USDEUR=X"];
    else if (c === "EUR") return [...keys, "EURUSD=X"];

    return [...keys, `${c}USD=X`, `${c}EUR=X`];
  }, []);
  */
  const keys = ["USDEUR=X", "EURUSD=X", "GBPEUR=X"];
  return await Quotes.getConversions(keys);
};

const calculateReturns = async (
  investment: TInvestment,
  quote: Quote
): Promise<TInvestment & TReturnsSymbol> => {
  if (quote.currency === "GBp") {
    quote.currency = "GBP";
    quote.regularMarketPrice = quote.regularMarketPrice! / 1000;
    quote.regularMarketPreviousClose = quote.regularMarketPreviousClose! / 1000;
  }

  const conversionRate = await Quotes.getConversion(
    investment.currency,
    quote.currency!
  );

  const investmentValue = investment.averagePrice * investment.quantity;
  const currentValue =
    (quote.regularMarketPrice! / conversionRate) * investment.quantity;
  const totalReturns = currentValue - investmentValue;
  const totalReturnsPercent = ((100 * currentValue) / investmentValue) - 100;
  const previousValue =
    (quote.regularMarketPreviousClose! / conversionRate) * investment.quantity;
  const oneDayReturns = currentValue - previousValue;
  const oneDayReturnsPercent = (oneDayReturns * 100) / previousValue;

  return {
    ...investment,
    investmentValue,
    currentValue,
    totalReturns,
    totalReturnsPercent,
    oneDayReturns,
    oneDayReturnsPercent,
  };
};
