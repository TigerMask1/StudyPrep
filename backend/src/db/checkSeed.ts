import { query } from '../config/database';

export async function checkSeed() {
  const result = await query('SELECT count(*) FROM "Subtopic"');
  const rows = result.rows as any[];
  console.log('Subtopic count:', rows[0].count);
}

if (require.main === module) {
  checkSeed();
}
