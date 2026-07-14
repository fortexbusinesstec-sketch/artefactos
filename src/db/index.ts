import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

type DB = LibSQLDatabase<typeof schema>;

let _db: DB | null = null;

function getDb(): DB {
  if (!_db) {
    const client: Client = createClient({
      url: process.env.DATABASE_URL!,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
    _db = drizzle(client, { schema });
  }
  return _db;
}

export const db = new Proxy({} as DB, {
  get(_, prop) {
    return (getDb() as any)[prop];
  },
});
