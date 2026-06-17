import { query } from '../src/lib/config/database';

async function main() {
  const tables = await query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  for (const row of tables.rows) {
    console.log("Table:", row.table_name);
    const columns = await query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${row.table_name}'`);
    for (const col of columns.rows) {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    }
  }
}

main().catch(console.error);
