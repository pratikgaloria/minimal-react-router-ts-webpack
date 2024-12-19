import fs from "fs";

export type SymbolChannel = "yahoo" | "trading212" | "tradingView" | "india" | "kuvera" | "crypto";

type TSymbol = {
  yahoo: string;
  trading212: string;
  tradingView?: string;
  india?: string;
  crypto?: string;
  kuvera?: string;
};

class Symbols {
  public data: TSymbol[] = [];

  constructor() {
    const content = fs.readFileSync(
      process.env.SYMBOLS_PATH as string,
      "utf-8"
    );
    this.data = JSON.parse(content);
  }

  get(
    key: SymbolChannel,
    value: string
  ): TSymbol | undefined {
    return this.data.find((symbol) => symbol[key] === value);
  }
}

export const symbols = new Symbols();