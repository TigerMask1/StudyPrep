import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export interface StudentProfile {
  id?: string;
  name: string;
  email: string;
  password?: string;
  class: number;
  targetYear: number;
  programmeStartDate?: Date;
  medium?: string;
  schoolHours?: any;
  availableHoursSchool?: number;
  availableHoursWeekend?: number;
  studyPreference?: string;
}

export const profileService = {
  async create(profile: StudentProfile) {
    const id = profile.id || uuidv4();
    const hashedPassword = await bcrypt.hash(profile.password || 'default_pass', 10);

    const sql = `
      INSERT INTO "Student" (
        "id", "name", "email", "password", "class", "targetYear",
        "medium", "availableHoursSchool", "availableHoursWeekend", "studyPreference"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const params = [
      id, profile.name, profile.email, hashedPassword,
      profile.class, profile.targetYear, profile.medium || 'English',
      profile.availableHoursSchool || 4.5, profile.availableHoursWeekend || 9.0,
      profile.studyPreference || 'mixed'
    ];
    const result = await query(sql, params);
    return result.rows[0];
  },

  async getById(id: string) {
    const sql = 'SELECT * FROM "Student" WHERE "id" = $1';
    const result = await query(sql, [id]);
    return result.rows[0];
  },

  async getByEmail(email: string) {
    const sql = 'SELECT * FROM "Student" WHERE "email" = $1';
    const result = await query(sql, [email]);
    return result.rows[0];
  },

  async update(id: string, updates: Partial<StudentProfile>) {
    const fields = Object.keys(updates);
    if (fields.includes('password')) {
      updates.password = await bcrypt.hash(updates.password!, 10);
    }

    const setClause = fields.map((f, i) => `"${f}" = $${i + 2}`).join(', ');
    const sql = `UPDATE "Student" SET ${setClause}, "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = $1 RETURNING *`;
    const params = [id, ...Object.values(updates)];
    const result = await query(sql, params);
    return result.rows[0];
  }
};
