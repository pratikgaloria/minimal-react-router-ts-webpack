import log from "npmlog";
import fs from "fs";
import { Channel } from ".";
import { TInvestment, TInvestmentType } from "..";
import { symbols } from "../../symbols";
import { Returns, TReturnsChannel, TReturnsSymbol } from "../../returns";
import { Quotes } from "../../quotes";
import { Quote } from "yahoo-finance2/dist/esm/src/modules/quote";

type CryptoPosition = {
  averagePrice: number;
  quantity: number;
  ticker: string;
  type: TInvestmentType;
};

export class ChannelCrypto extends Channel<CryptoPosition> {
  private investments: TInvestment[] = [];
  private symbols = new Set<string>();

  constructor(name: string) {
    super(name, false);
  }

  async fetch(): Promise<CryptoPosition[]> {
    log.info("Crypto", "fetching investments...");

    const data = fs.readFileSync(
      `${process.env.INVESTMENTS_PATH}/crypto.json`,
      "utf-8"
    );

    const investments = JSON.parse(data) as CryptoPosition[];
    investments.forEach((investment) => this.symbols.add(investment.ticker));

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

  private map(position: CryptoPosition): TInvestment {
    const symbol = symbols.get("crypto", position.ticker);

    return {
      id: `${this.name}_${position.ticker}`,
      quantity: position.quantity,
      averagePrice: position.averagePrice,
      currency: "EUR",
      type: position.type,
      channel: {
        name: this.name,
        symbol: position.ticker,
        fxImpact: 0,
      },
      symbols: {
        yahoo: symbol?.yahoo ?? "",
        tradingView: symbol?.tradingView ?? "",
      },
    };
  }
}

export const channelCrypto = new ChannelCrypto("crypto");
