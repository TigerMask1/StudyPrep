import { PrismaClient } from '@prisma/client';
import { templateEngine } from './templateEngine';
import { StudentProfile } from './profileService';

const prisma = new PrismaClient();

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

    // Fetch topics that haven't been completed yet using Prisma
    // We use a raw query or findMany with include/where
    const studentId = student.id;
    const studentClass = student.class;

    const dbTopics = await prisma.$queryRawUnsafe<any[]>(
      `SELECT s.* FROM "Subtopic" s
       LEFT JOIN "StudentSubtopicStatus" st ON s.id = st."subtopicId" AND st."studentId" = $1
       WHERE (st.status IS NULL OR st.status != 'completed')
       AND s.class = $2
       ORDER BY s.id ASC LIMIT 3`,
      studentId, studentClass
    );

    let finalTopics = dbTopics;
    if (finalTopics.length === 0) {
      const otherClass = student.class === 11 ? 12 : 11;
      finalTopics = await prisma.$queryRawUnsafe<any[]>(
        `SELECT s.* FROM "Subtopic" s
         LEFT JOIN "StudentSubtopicStatus" st ON s.id = st."subtopicId" AND st."studentId" = $1
         WHERE (st.status IS NULL OR st.status != 'completed')
         AND s.class = $2
         ORDER BY s.id ASC LIMIT 3`,
        studentId, otherClass
      );
    }

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const availableHours = isWeekend ? (student.availableHoursWeekend || 9.0) : (student.availableHoursSchool || 4.5);

    const intensity = templateEngine.getIntensityScore(finalTopics.length, 1, isWeekend ? 80 : 40);

    const atom: DailyPlanAtom = {
      date: date.toISOString().split('T')[0]!,
      phase,
      intensity_score: intensity,
      available_hours: availableHours,
      study_blocks: finalTopics.map((topic, index) => ({
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
          chapter: finalTopics[0]?.chapter || 'Revision',
          question_count: isWeekend ? 50 : 20,
          status: 'pending'
        }
      ],
      mentor_context: {
        yesterday_completion: 0.85,
        week_completion_rate: 0.78,
        current_weak_subjects: [],
        alert: finalTopics.length > 0 ? `Focus on completing ${finalTopics.length} new subtopics today.` : "Syllabus coverage looks great! Let's do some revision."
      }
    };

    return atom;
  },

  async savePlanAtom(studentId: string, atom: DailyPlanAtom) {
    const date = new Date(atom.date);
    await prisma.planAtom.upsert({
      where: {
        studentId_date: {
          studentId,
          date
        }
      },
      update: {
        data: atom as any,
        version: { increment: 1 }
      },
      create: {
        studentId,
        date,
        phase: atom.phase,
        intensityScore: atom.intensity_score,
        availableHours: atom.available_hours,
        data: atom as any
      }
    });
  }
};
