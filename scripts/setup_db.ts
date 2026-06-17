import { exec } from './src/lib/config/database.ts';
import dotenv from 'dotenv';
dotenv.config();

async function setup() {
  console.log('Setting up tables...');
  try {
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

      CREATE TABLE IF NOT EXISTS "StudentSubtopicStatus" (
        "id" TEXT PRIMARY KEY,
        "studentId" TEXT REFERENCES "Student"("id"),
        "subtopicId" TEXT REFERENCES "Subtopic"("id"),
        "status" TEXT DEFAULT 'not_started',
        "performance" DOUBLE PRECISION,
        "lastAttempted" TIMESTAMP WITH TIME ZONE,
        UNIQUE("studentId", "subtopicId")
      );

      CREATE TABLE IF NOT EXISTS "PlanAtom" (
        "id" TEXT PRIMARY KEY,
        "studentId" TEXT NOT NULL REFERENCES "Student"("id"),
        "date" DATE NOT NULL,
        "phase" TEXT NOT NULL,
        "intensityScore" INTEGER NOT NULL,
        "availableHours" DOUBLE PRECISION NOT NULL,
        "data" JSONB NOT NULL,
        "version" INTEGER DEFAULT 1,
        "mutationReason" TEXT,
        UNIQUE("studentId", "date")
      );

      CREATE TABLE IF NOT EXISTS "WeakTopicLog" (
        "id" TEXT PRIMARY KEY,
        "studentId" TEXT NOT NULL REFERENCES "Student"("id"),
        "subtopicId" TEXT NOT NULL REFERENCES "Subtopic"("id"),
        "errorCount" INTEGER DEFAULT 0,
        "lastTested" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "errorType" TEXT,
        "priorityScore" DOUBLE PRECISION DEFAULT 0,
        "status" TEXT DEFAULT 'active',
        UNIQUE("studentId", "subtopicId")
      );
    `);
    console.log('Tables created successfully.');
  } catch (err) {
    console.error('Setup failed:', err);
  } finally {
    process.exit(0);
  }
}

setup();
