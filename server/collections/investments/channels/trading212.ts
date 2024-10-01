import log from "npmlog";
import fs from "fs";
import { Channel } from ".";
import { TInvestment } from "..";
import { symbols } from "../../symbols";
import { Returns, TReturnsChannel, TReturnsSymbol } from "../../returns";
import { Quotes } from "../../quotes";
import { Quote } from "yahoo-finance2/dist/esm/src/modules/quote";

type Trading212Instrument = {
  currencyCode: string;
  name: string;
  shortname: string;
  ticker: string;
  type: string;
};

type Trading212PortfolioPosition = {
  averagePrice: number;
  currentPrice: number;
  fxPpl: number;
  initialFillDate: Date;
  ppl: number;
  quantity: number;
  ticker: string;
};

export class Trading212 extends Channel<Trading212PortfolioPosition> {
  private investments: TInvestment[] = [];
  private symbols = new Set<string>();
  private symbolsToCurrency = new Map<string, string>();
  private apiHeaders = {
    Authorization: process.env.TRADING212_API_KEY as string,
  };

  constructor(name: string) {
    super(name);
  }

  async fetch(): Promise<Trading212PortfolioPosition[]> {
    log.info("Trading212", "fetching investments...");

    const response = await fetch(
      `${process.env.TRADING212_API_URL}/api/v0/equity/portfolio`,
      {
        method: "GET",
        headers: this.apiHeaders,
      }
    );
    const investments =
      (await response.json()) as Trading212PortfolioPosition[];

    /* create symbol to currency map */
    investments.forEach((investment) => this.symbols.add(investment.ticker));
    const instruments = await this.readInstruments();
    instruments
      .filter((instrument) => this.symbols.has(instrument.ticker))
      .forEach((instrument) => {
        this.symbolsToCurrency.set(instrument.ticker, instrument.currencyCode);
      });

    investments
      .filter((investment) => !this.symbols.has(investment.ticker))
      .forEach((investment) => {
        log.warn(
          "Trading212",
          `Instrument not found for symbol: ${investment.ticker}`
        );
      });

    this.investments = investments.map((position) => this.map(position));

    return investments;
  }

  get(): TInvestment[] {
    return this.investments;
  }

  async getReturns(): Promise<TReturnsChannel> {
    const investments = this.get();
    const quotes = await Quotes.fetch();

    const allReturns: TReturnsSymbol[] = [];

    let oneDayReturns = 0;
    let totalReturns = 0;
    let totalFees = 0;

    for (const investment of investments) {
      const yahooSymbol = investment.symbols.yahoo;

      if (!yahooSymbol) {
        console.warn(
          "Returns",
          `quote not found for investment in ${investment.channel.name}: `,
          investment.channel.symbol
        );
        continue;
      }

      const quote = quotes.get(yahooSymbol) as Quote;
      const returns = await Returns.calculateReturns(investment, quote);

      const toEUR = await Quotes.getConversion(investment.currency, "EUR");
      oneDayReturns += returns.oneDayReturns * toEUR;
      totalReturns += returns.totalReturns * toEUR;
      totalFees += returns.totalFees;
      allReturns.push(returns);
    }

    return {
      oneDayReturns,
      totalReturns,
      totalFees,
      symbols: allReturns,
    };
  }

  private map(position: Trading212PortfolioPosition): TInvestment {
    const symbol = symbols.get("trading212", position.ticker);
    const { averagePrice, quantity, currency } =
      this.getSanitizedValues(position);

    return {
      id: `${this.name}_${position.ticker}`,
      quantity,
      averagePrice,
      currency,
      channel: {
        name: this.name,
        symbol: position.ticker,
        fees: position.fxPpl,
      },
      symbols: {
        yahoo: symbol?.yahoo ?? "",
        tradingView: symbol?.tradingView ?? "",
      },
    };
  }

  private getSanitizedValues(position: Trading212PortfolioPosition) {
    const { quantity, averagePrice } = position;
    const currency = this.symbolsToCurrency.get(position.ticker);

    if (currency === "GBX") {
      return {
        quantity: quantity / 1000,
        averagePrice: averagePrice / 1000,
        currency: "GBP",
      };
    }

    return {
      quantity,
      averagePrice,
      currency: currency ?? "USD",
    };
  }

  private async readInstruments() {
    log.info("Trading212", "reading instruments...");

    return JSON.parse(
      await fs.promises.readFile(
        process.env.TRADING212_INSTRUMENTS_PATH as string,
        "utf-8"
      )
    ) as Trading212Instrument[];
  }

  private async getInstruments() {
    log.info("Trading212", "fetching instruments...");

    const response = await fetch(
      `${process.env.TRADING212_API_URL}/api/v0/equity/metadata/instruments`,
      {
        method: "GET",
        headers: this.apiHeaders,
      }
    );

    return (await response.json()) as Promise<Trading212Instrument[]>;
  }
}

export const trading212 = new Trading212("trading212");
