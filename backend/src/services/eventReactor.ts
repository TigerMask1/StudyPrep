import { query, exec } from '../config/database';
import { planGenerator } from './planGenerator';
import { profileService } from './profileService';

export const eventReactor = {
  async handleTestResult(studentId: string, testResult: any) {
    console.log(`Handling TEST_RESULT_RECEIVED for student ${studentId}`);

    for (const subtopic of testResult.weakSubtopics) {
      const sql = `
        INSERT INTO "WeakTopicLog" ("id", "studentId", "subtopicId", "errorCount", "priorityScore")
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT ("studentId", "subtopicId") DO UPDATE SET
          "errorCount" = "WeakTopicLog"."errorCount" + EXCLUDED."errorCount",
          "priorityScore" = "WeakTopicLog"."priorityScore" + 1.0,
          "lastTested" = CURRENT_TIMESTAMP;
      `;
      const id = `${studentId}_${subtopic.id}`;
      await query(sql, [id, studentId, subtopic.id, 1, 1.0]);
    }

    const student = await profileService.getById(studentId);
    const todayAtom = await planGenerator.generateDay(student, new Date());

    todayAtom.practice_slots.push({
      slot_id: `WEAK_${Date.now()}`,
      type: 'weak_topic_drill',
      subtopic_id: testResult.weakSubtopics[0]?.id,
      injected_reason: 'Low score in recent test',
      question_count: 15,
      status: 'pending'
    });

    await planGenerator.savePlanAtom(studentId, todayAtom);
  },

  async handleSessionMissed(studentId: string, date: string) {
    console.log(`Handling SESSION_MISSED for student ${studentId} on ${date}`);
  }
};
