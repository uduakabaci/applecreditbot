import { drizzle } from 'drizzle-orm/bun-sqlite';
import { environment } from "../libs/environment"
export const db = drizzle(environment.DATABASE_URL);
