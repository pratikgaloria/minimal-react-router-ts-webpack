import { TInvestment } from "..";
import { TReturnsChannel } from "../../returns";

export class Channel<T> {
  constructor(public name: string = '') {}

  fetch(): Promise<T[]> {
    return Promise.resolve([]);
  }

  get(): TInvestment[] {
    return [];
  }

  getReturns(): Promise<TReturnsChannel> {
    return Promise.resolve({} as TReturnsChannel);
  }
}
