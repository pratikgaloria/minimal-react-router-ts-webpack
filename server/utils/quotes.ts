import yahooFinance from "yahoo-finance2";
import { QuoteOptions } from "yahoo-finance2/dist/esm/src/modules/quote";

export class Quotes {
  static conversions = new Map<string, number>();

  static quoteOptions: QuoteOptions = {
    fields: [
      "symbol",
      "currency",
      "displayName",
      "market",
      "marketState",
      "regularMarketPrice",
      "regularMarketDayHigh",
      "regularMarketDayLow",
      "regularMarketPreviousClose",
      "regularMarketVolume",
      "regularMarketChange",
      "regularMarketChangePercent",
    ],
  };

  static async get(symbols: string | string[]) {
    return yahooFinance.quote(symbols, { ...this.quoteOptions, return: "object" });
  }

  static async historical(
    symbol: string,
    startFrom: string,
    interval: "1d" | "1wk" | "1mo" = "1d"
  ) {
    return yahooFinance.historical(symbol, { period1: startFrom, interval });
  }

  static async getConversions(keys: string[]) {
    const conversions = await this.get(keys);

    for (const key in conversions) {
      Quotes.conversions.set(key, conversions[key].regularMarketPrice);
    }

    return Quotes.conversions;
  }

  static async getConversion(from: string, to: string) {
    if (from === to) return 1;

    const key = `${from}${to}=X`;
    if (Quotes.conversions.has(key)) {
      return Quotes.conversions.get(key)!;
    }

    const rate = (await yahooFinance.quote(key)).regularMarketPrice!;
    Quotes.conversions.set(key, rate);
    return rate;
  }
}
