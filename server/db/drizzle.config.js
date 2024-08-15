
import pkg from 'pg';
const { Pool } = pkg;

import { drizzle } from 'drizzle-orm/node-postgres';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

  