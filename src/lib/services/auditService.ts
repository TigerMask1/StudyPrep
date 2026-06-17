import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export const auditService = {
  async logMutation(planAtomId: string, version: number, data: any, reason: string, diff?: any) {
    const id = uuidv4();
    const sql = `
      INSERT INTO "PlanAtomVersion" ("id", "planAtomId", "version", "data", "diff", "reason")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const result = await query(sql, [
      id, planAtomId, version, JSON.stringify(data),
      diff ? JSON.stringify(diff) : null, reason
    ]);
    return result.rows[0];
  },

  async getAuditTrail(planAtomId: string) {
    const sql = `
      SELECT * FROM "PlanAtomVersion"
      WHERE "planAtomId" = $1
      ORDER BY "version" DESC;
    `;
    const result = await query(sql, [planAtomId]);
    return result.rows;
  }
};
