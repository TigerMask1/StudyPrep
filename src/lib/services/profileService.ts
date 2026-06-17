import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  class: number;
  targetYear: number;
  programmeStartDate?: Date;
  availableHoursSchool?: number;
  availableHoursWeekend?: number;
}

export const profileService = {
  async create(data: any): Promise<StudentProfile> {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(data.password || 'password123', 10);
    const sql = `
      INSERT INTO "Student" ("id", "name", "email", "password", "class", "targetYear", "programmeStartDate", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    try {
      const result = await query(sql, [id, data.name, data.email, hashedPassword, data.class, data.targetYear]);
      return result.rows[0];
    } catch (err: any) {
      console.error('profileService.create error:', err.message);
      throw err;
    }
  },

  async getById(id: string): Promise<StudentProfile | null> {
    const sql = 'SELECT * FROM "Student" WHERE "id" = $1';
    try {
      const result = await query(sql, [id]);
      return result.rows[0] || null;
    } catch (err: any) {
      console.error('profileService.getById error:', err.message);
      return null;
    }
  },

  async getByEmail(email: string): Promise<StudentProfile | null> {
    const sql = 'SELECT * FROM "Student" WHERE "email" = $1';
    try {
      const result = await query(sql, [email]);
      return result.rows[0] || null;
    } catch (err: any) {
      console.error('profileService.getByEmail error:', err.message);
      return null;
    }
  }
};
