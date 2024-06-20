import { Collection, ObjectId } from "mongodb";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

export type TInvestment = {
  _id: ObjectId;
  symbol: string;
  quantity: number;
  averagePrice: number;
  currency: string;
  tvSymbol: string;
};

export class Investments {
  filePath = join("./server/data", "investments.json");
  constructor(private collection: Collection) {}

  async fetch(): Promise<TInvestment[]> {
    console.log("*** fetching investments from db...");
    const data = await this.collection
      .find()
      .map((record) => record as TInvestment)
      .toArray();

    writeFileSync(this.filePath, JSON.stringify(data), { encoding: "utf-8" });

    return data;
  }

  async getAll(): Promise<TInvestment[]> {
    try {
      const data = readFileSync(this.filePath, { encoding: "utf-8" });
      console.log("*** reading investments from file...");
      return JSON.parse(data) as TInvestment[];
    } catch (e) {
      console.log(e);
      return this.fetch();
    }
  }

  async get(symbol: string): Promise<TInvestment> {
    return this.collection.findOne({ symbol }).then((i) => i as TInvestment);
  }

  async insert(investment: Omit<TInvestment, "_id">) {
    return this.collection.insertOne(investment);
  }

  async insertMany(investments: Omit<TInvestment, "_id">[]) {
    return this.collection.insertMany(investments);
  }

  async update(
    symbol: string,
    investment: Partial<Omit<TInvestment, "symbol" | "_id">>
  ) {
    return this.collection.findOneAndUpdate(
      { symbol },
      { $set: { ...investment } }
    );
  }

  async append(symbol: string, fields: Record<string, any>) {
    return this.collection.findOneAndUpdate(
      { symbol },
      { $set: { ...fields } }
    );
  }

  async delete(symbol: string) {
    return this.collection.findOneAndDelete({ symbol });
  }
}
