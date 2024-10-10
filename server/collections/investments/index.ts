import fs from "fs";
import log from "npmlog";
import { Channel } from "./channels";
import { channelTrading212 as trading212 } from "./channels/trading212";
import { channelIndia as india } from "./channels/india";
import { TReturnsChannel } from "../returns";

export type TInvestmentType = "stock" | "etf";

export type TInvestment = {
  id: string;
  quantity: number;
  averagePrice: number;
  currency: string;
  type: TInvestmentType;
  channel: {
    name: string;
    symbol: string;
    fees: number;
  };
  symbols: {
    yahoo: string;
    tradingView: string;
  }
};

export class Investments {
  static channels: Channel<unknown>[] = [trading212, india];

  static async fetch() {
    await Promise.all(
      this.channels.map(async (channel) => {
        log.info("Investments", `fetching portfolio for ${channel.name}...`);
        const data = await channel.fetch();

        if (channel.writeToDisk) {
          fs.writeFileSync(
            `${process.env.INVESTMENTS_PATH}/${channel.name}.json`,
            JSON.stringify(data)
          );
        }
      })
    );
  }

  static async get() {
    const investments = new Map<string, TInvestment[]>();

    this.channels.forEach((channel) => {
      investments.set(channel.name, channel.get());
    });

    return Object.fromEntries(investments.entries());
  }

  static async getReturns() {
    const channelReturns = new Map<string, TReturnsChannel>();

    await Promise.all(
      this.channels.map(async (channel) => {
        const returns = await channel.getReturns();
        channelReturns.set(channel.name, returns);
      })
    );

    return Object.fromEntries(channelReturns.entries());
  }
}
