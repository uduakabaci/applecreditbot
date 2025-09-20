import { drizzle } from 'drizzle-orm/libsql';
import { environment } from "../libs/environment"
export const db = drizzle(environment.DATABASE_URL);
