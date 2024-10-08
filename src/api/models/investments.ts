export type TInvestment = {
  id: string;
  quantity: number;
  averagePrice: number;
  currency: string;
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