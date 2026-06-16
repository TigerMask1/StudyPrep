import { query } from '../config/database';
import { templateEngine } from './templateEngine';
import { StudentProfile } from './profileService';

export interface DailyPlanAtom {
  date: string;
  phase: string;
  intensity_score: number;
  available_hours: number;
  study_blocks: any[];
  practice_slots: any[];
  mentor_context: any;
}

export const planGenerator = {
  async generateDay(student: StudentProfile, date: Date): Promise<DailyPlanAtom> {
    const phase = templateEngine.getCurrentPhase(new Date(student.programmeStartDate || Date.now()), date);

    // Fetch topics from database instead of mock
    const topicsResult = await query(
      'SELECT * FROM "Subtopic" WHERE "class" = $1 LIMIT 3',
      [student.class]
    );
    const dbTopics = topicsResult.rows as any[];

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const availableHours = isWeekend ? (student.availableHoursWeekend || 9.0) : (student.availableHoursSchool || 4.5);

    const atom: DailyPlanAtom = {
      date: date.toISOString().split('T')[0]!,
      phase,
      intensity_score: templateEngine.getIntensityScore(dbTopics.length, 1, 40),
      available_hours: availableHours,
      study_blocks: dbTopics.map((topic, index) => ({
        block_id: `BLK_${date.getTime()}_${index}`,
        subject: topic.subject,
        chapter: topic.chapter,
        topics: [
          {
            topic_id: topic.id,
            name: topic.name,
            type: 'new_learning',
            estimated_minutes: 60
          }
        ],
        status: 'pending'
      })),
      practice_slots: [
        {
          slot_id: `PRC_${date.getTime()}_1`,
          type: 'R7_revision',
          chapter: 'General Review',
          question_count: 20,
          status: 'pending'
        }
      ],
      mentor_context: {
        yesterday_completion: 0.85,
        week_completion_rate: 0.78,
        current_weak_subjects: ['Physics'],
        alert: `Phase ${phase} in progress. ${dbTopics.length} new topics assigned.`
      }
    };

    return atom;
  },

  async savePlanAtom(studentId: string, atom: DailyPlanAtom) {
    const sql = `
      INSERT INTO "PlanAtom" ("id", "studentId", "date", "phase", "intensityScore", "availableHours", "data")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT ("studentId", "date") DO UPDATE SET
        "data" = EXCLUDED."data",
        "version" = "PlanAtom"."version" + 1
      RETURNING *;
    `;
    const id = `${studentId}_${atom.date}`;
    await query(sql, [id, studentId, atom.date, atom.phase, atom.intensity_score, atom.available_hours, JSON.stringify(atom)]);
  }
};
