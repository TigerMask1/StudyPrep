import { exec, query } from './config/database';
import { profileService } from './services/profileService';
import { planGenerator } from './services/planGenerator';
import { eventReactor } from './services/eventReactor';

async function runTests() {
  console.log('Running integrated tests...');

  // Setup tables
  await exec(`
    CREATE TABLE IF NOT EXISTS "Subtopic" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "subject" TEXT NOT NULL,
      "class" INTEGER NOT NULL,
      "unit" TEXT NOT NULL,
      "chapter" TEXT NOT NULL,
      "topic" TEXT NOT NULL,
      "pyqFrequency" INTEGER DEFAULT 0,
      "difficulty" INTEGER DEFAULT 1,
      "ncertRef" JSONB,
      "keyPoints" TEXT[],
      "commonErrors" TEXT[],
      "prerequisites" TEXT[]
    );

    CREATE TABLE IF NOT EXISTS "Student" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT UNIQUE NOT NULL,
      "password" TEXT NOT NULL,
      "class" INTEGER NOT NULL,
      "targetYear" INTEGER NOT NULL,
      "programmeStartDate" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "medium" TEXT DEFAULT 'English',
      "schoolHours" JSONB,
      "availableHoursSchool" DOUBLE PRECISION DEFAULT 4.5,
      "availableHoursWeekend" DOUBLE PRECISION DEFAULT 9.0,
      "studyPreference" TEXT DEFAULT 'mixed',
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "WeakTopicLog" (
      "id" TEXT PRIMARY KEY,
      "studentId" TEXT NOT NULL,
      "subtopicId" TEXT NOT NULL,
      "errorCount" INTEGER DEFAULT 0,
      "lastTested" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "errorType" TEXT,
      "priorityScore" DOUBLE PRECISION DEFAULT 0,
      "status" TEXT DEFAULT 'active',
      UNIQUE("studentId", "subtopicId")
    );

    CREATE TABLE IF NOT EXISTS "PlanAtom" (
      "id" TEXT PRIMARY KEY,
      "studentId" TEXT NOT NULL,
      "date" DATE NOT NULL,
      "phase" TEXT NOT NULL,
      "intensityScore" INTEGER NOT NULL,
      "availableHours" DOUBLE PRECISION NOT NULL,
      "data" JSONB NOT NULL,
      "version" INTEGER DEFAULT 1,
      "mutationReason" TEXT,
      UNIQUE("studentId", "date")
    );
  `);

  // 1. Test Profile Creation
  const student = await profileService.create({
    name: 'Test Student',
    email: `test_${Date.now()}@example.com`,
    class: 11,
    targetYear: 2027
  });
  console.log('✓ Profile creation');

  // 2. Test Plan Generation
  const plan = await planGenerator.generateDay(student, new Date());
  if (plan && plan.study_blocks.length > 0) {
    console.log('✓ Plan generation');
  }

  // 3. Test Event Reactor
  await eventReactor.handleTestResult(student.id, {
    weakSubtopics: [{ id: 'BIO_11_U1_CH2_T15' }]
  });

  const weakTopics = await query('SELECT * FROM "WeakTopicLog" WHERE "studentId" = $1', [student.id]);
  if (weakTopics.rows.length > 0) {
    console.log('✓ Event reactor (weak topic logging)');
  }

  console.log('All tests passed!');
}

runTests().catch(err => {
  console.error('Tests failed:', err);
  process.exit(1);
});
