import { query } from '../src/lib/config/database';
import dotenv from 'dotenv';
dotenv.config();

async function list() {
  try {
    const res = await query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log("Tables:", res.rows.map(r => r.table_name));
  } catch (err) {
    console.error(err);
  }
}
list();
