import { MongoClient, Db } from "mongodb";
import { Returns } from "./collections/returns";

process.env.MONGODB_URI =
  "mongodb+srv://admin:24December@cluster0.e17vuno.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export class DB {
  private client!: MongoClient;
  platform!: Db;

  constructor() {
    this.connect();
  }

  private async connect() {
    if (this.client) return this.client;

    if (!process.env.MONGODB_URI) {
      throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
    }

    this.client = new MongoClient(process.env.MONGODB_URI);
    this.client.connect().catch((error) => {
      throw new Error(`Error while connecting to databse: ${error}`);
    });

    this.platform = this.client.db("platform");
  }

  get returns() {
    return new Returns();
  }
}

export const db = new DB();
