import log from "npmlog";
import { Channel } from ".";
import { TInvestment, TInvestmentType } from "..";
import { symbols } from "../../symbols";
import { Returns, TReturnsChannel, TReturnsSymbol } from "../../returns";
import { Quotes } from "../../quotes";
import { Quote } from "yahoo-finance2/dist/esm/src/modules/quote";

type KuveraPosition = {
  allottedAmount: number;
  units: number;
};

type KuveraPositionWithTicker = KuveraPosition & {
  ticker: string;
  type: TInvestmentType;
};

type KuveraQuote = {
  code: string;
  short_name: string;
  name: string;
  nav: {
    nav: number;
  };
  last_nav: {
    nav: number;
  };
};

export class ChannelKuvera extends Channel<KuveraPosition> {
  private investments: TInvestment[] = [];
  private symbols = new Set<string>();
  private apiHeaders = {
    Authorization: process.env.KUVERA_TOKEN as string,
  };

  constructor(name: string) {
    super(name);
  }

  async fetch(): Promise<KuveraPosition[]> {
    log.info("Kuvera", "fetching investments...");

    const response = await fetch(
      process.env.KUVERA_HOLDINGS_API_URL as string,
      {
        method: "GET",
        headers: this.apiHeaders,
      }
    );
    const investmentsData = (await response.json()) as Record<
      string,
      KuveraPosition[]
    >;

    const positions = Object.entries(investmentsData).map(([key, folios]) => {
      this.symbols.add(key);

      return folios.reduce<KuveraPositionWithTicker>(
        (acc, folio) => ({
          ...acc,
          allottedAmount: folio.allottedAmount + acc.allottedAmount,
          units: folio.units + acc.units,
        }),
        {
          ticker: key,
          type: "etf",
          allottedAmount: 0,
          units: 0,
        }
      );
    });

    this.investments = positions.map((position) => this.map(position));

    return positions;
  }

  get(): TInvestment[] {
    return this.investments;
  }

  private async getQuotes() {
    const url = `${process.env.KUVERA_SCHEMES_API_URL}/${Array.from(
      this.symbols
    ).join("|")}.json`;

    const response = await fetch(url);
    const quotesData = (await response.json()) as KuveraQuote[];

    return Object.fromEntries(
      quotesData.map((quote) => [
        quote.code,
        {
          currency: "INR",
          displayName: quote.name,
          shortName: quote.short_name,
          regularMarketPrice: quote.nav.nav,
          regularMarketPreviousClose: quote.last_nav.nav,
        } as Quote,
      ])
    );
  }

  async getReturns(): Promise<TReturnsChannel> {
    const investments = this.get();
    const quotes = await this.getQuotes();

    const allReturns: TReturnsSymbol[] = [];

    let oneDayReturns = 0;
    let totalReturns = 0;
    let currentValue = 0;
    let otherImpact = 0;
    let pl = 0;

    for (const investment of investments) {
      const returns = await Returns.calculate(
        investment,
        quotes[investment.channel.symbol]
      );

      const toEUR = await Quotes.getConversion(investment.currency, "EUR");
      oneDayReturns += returns.oneDayReturns * toEUR;
      totalReturns += returns.totalReturns * toEUR;
      currentValue += returns.currentValue * toEUR;
      otherImpact += returns.otherImpact * toEUR;
      pl += returns.pl * toEUR;
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

  private map(position: KuveraPositionWithTicker): TInvestment {
    const symbol = symbols.get("kuvera", position.ticker);

    return {
      id: `${this.name}_${position.ticker}`,
      quantity: position.units,
      averagePrice: position.allottedAmount / position.units,
      currency: "INR",
      type: position.type,
      channel: {
        name: this.name,
        symbol: position.ticker,
        fxImpact: 0,
      },
      symbols: {
        yahoo: position.ticker,
        tradingView: symbol?.tradingView ?? "",
      },
    };
  }
}

export const channelKuvera = new ChannelKuvera("kuvera");
