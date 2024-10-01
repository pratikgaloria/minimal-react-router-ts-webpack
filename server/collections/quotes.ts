import yahooFinance from "yahoo-finance2";
import log from "npmlog";
import { QuoteOptions, QuoteResponseMap } from "yahoo-finance2/dist/esm/src/modules/quote";
import { symbols } from "./symbols";

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

  static async fetch() {
    const yahooSymbols = symbols.data.map((symbol) => symbol.yahoo);
    return this.get(yahooSymbols);
  }

  static async get(symbols: string[]): Promise<QuoteResponseMap> {
    return yahooFinance.quote(symbols, {
      ...this.quoteOptions,
      return: "map",
    });
  }

  static async historical(
    symbol: string,
    startFrom: string,
    interval: "1d" | "1wk" | "1mo" = "1d"
  ) {
    return yahooFinance.historical(symbol, { period1: startFrom, interval });
  }

  static async getConversions(keys: string[]) {
    const conversionQuotes = await this.get(keys);

    conversionQuotes.forEach((quote, key) => {
      if (quote.regularMarketPrice) {
        this.conversions.set(key, quote.regularMarketPrice);
      }
    });

    return this.conversions;
  }

  static async getConversion(from: string, to: string) {
    if (from === to) return 1;

    const key = `${from}${to}=X`;
    if (Quotes.conversions.has(key)) {
      return Quotes.conversions.get(key)!;
    }

    const quote = await yahooFinance.quote(key);
    try {
      const rate = quote.regularMarketPrice!;
      Quotes.conversions.set(key, rate);
      return rate;
    } catch (error) {
      log.warn("Quotes", `Conversion rate not found for ${key}`);
      return 1;
    }
  }
}
