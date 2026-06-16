import { exec, query } from '../config/database';

const subtopics = [
  {
    id: 'BIO_11_U1_CH2_T15',
    name: 'Ascomycetes — features, examples (Aspergillus, Penicillium, Neurospora, yeast)',
    subject: 'Biology',
    class: 11,
    unit: 'Diversity in Living World',
    chapter: 'Biological Classification',
    topic: 'Kingdom Fungi',
    pyq_frequency: 3,
    difficulty: 2,
    ncert_ref: JSON.stringify({ book: 'Biology Part I Class XI', chapter: 2, pages: '22-24' }),
    key_points: ['Cell wall made of chitin', 'Reproduce by spores — conidia (asexual), ascospores in asci (sexual)', 'Examples: Aspergillus niger (citric acid), Penicillium notatum (antibiotic), Neurospora (genetic studies), Saccharomyces (fermentation)'],
    common_errors: ['Confusing Ascomycetes with Basidiomycetes (Agaricus is Basidiomycetes, not Ascomycetes)', 'Forgetting that yeast reproduces by budding (asexual) AND sexual spores'],
    prerequisites: ['BIO_11_U1_CH2_T13']
  },
];

export async function seed() {
  console.log('Seeding database started...');

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
    `);

    for (const subtopic of subtopics) {
      await query(`
        INSERT INTO "Subtopic" ("id", "name", "subject", "class", "unit", "chapter", "topic", "pyqFrequency", "difficulty", "ncertRef", "keyPoints", "commonErrors", "prerequisites")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT ("id") DO UPDATE SET
          "name" = EXCLUDED."name",
          "pyqFrequency" = EXCLUDED."pyqFrequency",
          "difficulty" = EXCLUDED."difficulty",
          "ncertRef" = EXCLUDED."ncertRef",
          "keyPoints" = EXCLUDED."keyPoints",
          "commonErrors" = EXCLUDED."commonErrors",
          "prerequisites" = EXCLUDED."prerequisites";
      `, [
        subtopic.id,
        subtopic.name,
        subtopic.subject,
        subtopic.class,
        subtopic.unit,
        subtopic.chapter,
        subtopic.topic,
        subtopic.pyq_frequency,
        subtopic.difficulty,
        subtopic.ncert_ref,
        subtopic.key_points,
        subtopic.common_errors,
        subtopic.prerequisites
      ]);
    }

    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seeding failed:', err);
  }
}

if (require.main === module) {
  seed();
}
