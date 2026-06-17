import { query } from '../src/lib/config/database.ts';
import dotenv from 'dotenv';
dotenv.config();

const neetSyllabus = [
  // BIOLOGY - CLASS 11
  {
    id: 'BIO_11_U1_CH1_T1',
    name: 'The Living World - Biodiversity & Taxonomy',
    subject: 'Biology', class: 11, unit: 'Diversity in Living World', chapter: 'The Living World', topic: 'What is Living?',
    pyqFrequency: 2, difficulty: 1,
    keyPoints: ['Living organisms show growth, reproduction, metabolism', 'Biodiversity refers to number and types of organisms', 'Binomial nomenclature by Linnaeus'],
    commonErrors: ['Confusing growth in non-living vs living'],
    ncertRef: { book: 'Biology Class 11', chapter: 1, pages: '1-15' }
  },
  {
    id: 'BIO_11_U1_CH2_T1',
    name: 'Biological Classification - Five Kingdom System',
    subject: 'Biology', class: 11, unit: 'Diversity in Living World', chapter: 'Biological Classification', topic: 'Kingdom Systems',
    pyqFrequency: 4, difficulty: 2,
    keyPoints: ['Whittaker proposed 5 kingdom classification', 'Monera, Protista, Fungi, Plantae, Animalia', 'Basis: cell structure, thallus organization, nutrition'],
    commonErrors: ['Wrong kingdom for Cyanobacteria'],
    ncertRef: { book: 'Biology Class 11', chapter: 2, pages: '16-30' }
  },
  {
    id: 'BIO_11_U3_CH8_T1',
    name: 'Cell: The Unit of Life - Prokaryotic Cell',
    subject: 'Biology', class: 11, unit: 'Cell: Structure & Function', chapter: 'Cell: The Unit of Life', topic: 'Cell Types',
    pyqFrequency: 5, difficulty: 2,
    keyPoints: ['Cell theory by Schleiden and Schwann', 'Prokaryotic cells lack membrane-bound nucleus', 'Mesosomes and inclusion bodies'],
    commonErrors: ['Confusing cell wall composition in Monera vs Fungi'],
    ncertRef: { book: 'Biology Class 11', chapter: 8, pages: '125-135' }
  },
  // PHYSICS - CLASS 11
  {
    id: 'PHY_11_U1_CH2_T1',
    name: 'Units and Measurements - Error Analysis',
    subject: 'Physics', class: 11, unit: 'Physical World and Measurement', chapter: 'Units and Measurements', topic: 'Errors',
    pyqFrequency: 5, difficulty: 2,
    keyPoints: ['Absolute error, Relative error, Percentage error', 'Combination of errors in arithmetic operations', 'Significant figures rules'],
    commonErrors: ['Incorrect addition of relative errors in product'],
    ncertRef: { book: 'Physics Class 11', chapter: 2, pages: '16-35' }
  },
  {
    id: 'PHY_11_U2_CH3_T1',
    name: 'Motion in a Straight Line - Kinematics Equations',
    subject: 'Physics', class: 11, unit: 'Kinematics', chapter: 'Motion in a Straight Line', topic: 'Equations of Motion',
    pyqFrequency: 4, difficulty: 1,
    keyPoints: ['v = u + at', 's = ut + 1/2at^2', 'v^2 = u^2 + 2as'],
    commonErrors: ['Forgetting to check sign of acceleration'],
    ncertRef: { book: 'Physics Class 11', chapter: 3, pages: '40-55' }
  },
  // CHEMISTRY - CLASS 11
  {
    id: 'CHEM_11_U1_CH1_T1',
    name: 'Some Basic Concepts of Chemistry - Mole Concept',
    subject: 'Chemistry', class: 11, unit: 'Some Basic Concepts of Chemistry', chapter: 'Basic Concepts', topic: 'Mole Concept',
    pyqFrequency: 5, difficulty: 3,
    keyPoints: ['1 mole = 6.022 x 10^23 entities', 'Molar mass and Avogadro number', 'Stoichiometry and limiting reagent'],
    commonErrors: ['Confusing molarity with molality'],
    ncertRef: { book: 'Chemistry Class 11', chapter: 1, pages: '1-25' }
  },
  {
    id: 'CHEM_11_U2_CH2_T1',
    name: 'Structure of Atom - Bohr Model',
    subject: 'Chemistry', class: 11, unit: 'Structure of Atom', chapter: 'Structure of Atom', topic: 'Atomic Models',
    pyqFrequency: 5, difficulty: 2,
    keyPoints: ['Postulates of Bohr model', 'Energy of orbits and hydrogen spectrum', 'Quantum numbers and electron configuration'],
    commonErrors: ['Violating Hunds rule in configuration'],
    ncertRef: { book: 'Chemistry Class 11', chapter: 2, pages: '30-60' }
  }
];

async function seed() {
  console.log('Seeding NEET 2024 Syllabus...');
  try {
    for (const sub of neetSyllabus) {
      await query(`
        INSERT INTO "Subtopic" ("id", "name", "subject", "class", "unit", "chapter", "topic", "pyqFrequency", "difficulty", "ncertRef", "keyPoints", "commonErrors", "prerequisites")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT ("id") DO UPDATE SET
          "name" = EXCLUDED."name",
          "pyqFrequency" = EXCLUDED."pyqFrequency",
          "difficulty" = EXCLUDED."difficulty";
      `, [
        sub.id, sub.name, sub.subject, sub.class, sub.unit, sub.chapter, sub.topic,
        sub.pyqFrequency, sub.difficulty, JSON.stringify(sub.ncertRef),
        sub.keyPoints, sub.commonErrors, []
      ]);
    }
    console.log('Seeding complete.');
    const result = await query('SELECT count(*) FROM "Subtopic"');
    console.log(`Verified Subtopic count: ${result.rows[0].count}`);
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    process.exit(0);
  }
}

seed();
