import log from "npmlog";
import fs from "fs";
import { Channel } from ".";
import { TInvestment, TInvestmentType } from "..";
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

export class ChannelTrading212 extends Channel<Trading212PortfolioPosition> {
  private investments: TInvestment[] = [];
  private symbols = new Set<string>();
  private instruments = new Map<string, { currency: string; type: string }>();
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
        this.instruments.set(instrument.ticker, {
          currency: instrument.currencyCode,
          type: instrument.type,
        });
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
    let currentValue = 0;
    let otherImpact = 0;
    let pl = 0;

    for (const investment of investments) {
      const yahooSymbol = investment.symbols.yahoo;

      if (!yahooSymbol) {
        log.warn(
          "Returns",
          `quote not found for investment in ${investment.channel.name}: ${investment.channel.symbol}`
        );
        continue;
      }

      const quote = quotes.get(yahooSymbol) as Quote;
      const returns = await Returns.calculate(investment, quote);

      const toEUR = await Quotes.getConversion(investment.currency, "EUR");
      oneDayReturns += returns.oneDayReturns * toEUR;
      totalReturns += returns.totalReturns * toEUR;
      otherImpact += returns.otherImpact; // always in EUR
      pl += returns.pl; // always in EUR
      currentValue += returns.currentValue; // always in EUR
      allReturns.push(returns);
    }

    return {
      oneDayReturns,
      totalReturns,
      currentValue,
      otherImpact,
      pl,
      symbols: allReturns,
    };
  }

  private map(position: Trading212PortfolioPosition): TInvestment {
    const symbol = symbols.get("trading212", position.ticker);
    const { averagePrice, quantity, currency, type } =
      this.getSanitizedValues(position);

    return {
      id: `${this.name}_${position.ticker}`,
      quantity,
      averagePrice,
      currency,
      type,
      channel: {
        name: this.name,
        symbol: position.ticker,
        fxImpact: position.fxPpl,
      },
      symbols: {
        yahoo: symbol?.yahoo ?? "",
        tradingView: symbol?.tradingView ?? "",
      },
    };
  }

  private getSanitizedValues(position: Trading212PortfolioPosition) {
    const { quantity, averagePrice } = position;
    const instrument = this.instruments.get(position.ticker);

    const type = instrument?.type
      ? (instrument.type.toLowerCase() as TInvestmentType)
      : "stock";

    if (instrument!.currency === "GBX") {
      return {
        quantity: quantity / 1000,
        averagePrice: averagePrice / 1000,
        currency: "GBP",
        type,
      };
    }

    return {
      quantity,
      averagePrice,
      currency: instrument!.currency ?? "USD",
      type,
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

export const channelTrading212 = new ChannelTrading212("trading212");
