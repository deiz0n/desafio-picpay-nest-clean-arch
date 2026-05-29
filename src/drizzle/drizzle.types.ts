import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

export type DrizzleDB = PostgresJsDatabase<typeof schema>;
export type DrizzleTransaction = Parameters<
  Parameters<DrizzleDB['transaction']>[0]
>[0];
