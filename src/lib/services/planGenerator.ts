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

    // Logic for 2-year journey
    // Phase 1: Syllabus completion
    // Fetch topics that haven't been completed yet
    const topicsResult = await query(
      `SELECT s.* FROM "Subtopic" s
       LEFT JOIN "StudentSubtopicStatus" st ON s.id = st."subtopicId" AND st."studentId" = $1
       WHERE (st.status IS NULL OR st.status != 'completed')
       AND s.class = $2
       ORDER BY s.id ASC LIMIT 3`,
      [student.id, student.class]
    );
    let dbTopics = topicsResult.rows as any[];

    // If no topics found for current class, try other class
    if (dbTopics.length === 0) {
      const otherClass = student.class === 11 ? 12 : 11;
      const otherTopicsResult = await query(
        `SELECT s.* FROM "Subtopic" s
         LEFT JOIN "StudentSubtopicStatus" st ON s.id = st."subtopicId" AND st."studentId" = $1
         WHERE (st.status IS NULL OR st.status != 'completed')
         AND s.class = $2
         ORDER BY s.id ASC LIMIT 3`,
        [student.id, otherClass]
      );
      dbTopics = otherTopicsResult.rows as any[];
    }

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const availableHours = isWeekend ? (student.availableHoursWeekend || 9.0) : (student.availableHoursSchool || 4.5);

    // Intensity based on topics and phase
    const intensity = templateEngine.getIntensityScore(dbTopics.length, 1, isWeekend ? 80 : 40);

    const atom: DailyPlanAtom = {
      date: date.toISOString().split('T')[0]!,
      phase,
      intensity_score: intensity,
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
            estimated_minutes: 60,
            ncert: topic.ncertRef
          }
        ],
        status: 'pending'
      })),
      practice_slots: [
        {
          slot_id: `PRC_${date.getTime()}_1`,
          type: 'daily_drill',
          chapter: dbTopics[0]?.chapter || 'Revision',
          question_count: isWeekend ? 50 : 20,
          status: 'pending'
        }
      ],
      mentor_context: {
        yesterday_completion: 0.85,
        week_completion_rate: 0.78,
        current_weak_subjects: [],
        alert: dbTopics.length > 0 ? `Focus on completing ${dbTopics.length} new subtopics today.` : "Syllabus coverage looks great! Let's do some revision."
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
