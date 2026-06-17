import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  console.log("Testing DB connection with URL:", process.env.DATABASE_URL?.replace(/:[^:]+@/, ':****@'));
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const start = Date.now();
    const client = await pool.connect();
    console.log("Connected successfully in", Date.now() - start, "ms");
    const res = await client.query('SELECT NOW()');
    console.log("Query result:", res.rows[0]);
    client.release();
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await pool.end();
  }
}

test();
