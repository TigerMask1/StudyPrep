import { profileService } from '../src/lib/services/profileService';
import { planGenerator } from '../src/lib/services/planGenerator';
import { query } from '../src/lib/config/database';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const email = `test_${Date.now()}@logic.com`;
  console.log("1. Creating student...");
  const student = await profileService.create({
    name: "Logic Test",
    email,
    class: 11,
    targetYear: 2027
  });
  console.log("Student created:", student.id);

  console.log("2. Generating plan...");
  const dateStr = new Date().toISOString().split('T')[0];
  const plan = await planGenerator.generateDay(student, new Date(dateStr));
  await planGenerator.savePlanAtom(student.id, plan);
  console.log("Plan saved.");

  console.log("3. Fetching plan back...");
  const result = await query(
    'SELECT * FROM "PlanAtom" WHERE "studentId" = $1 AND "date"::date = $2::date',
    [student.id, dateStr]
  );
  console.log("Fetch result rows:", result.rows.length);
  if (result.rows.length > 0) {
    console.log("Plan data found:", !!result.rows[0].data);
  } else {
    console.log("PLAN NOT FOUND IN DB!");
    // List all plans for this student
    const all = await query('SELECT id, date FROM "PlanAtom" WHERE "studentId" = $1', [student.id]);
    console.log("All plans for student:", all.rows);
  }
}

test().catch(console.error);
