import { PGlite } from '@electric-sql/pglite';
import path from 'path';

let db: PGlite;

export const getDb = async () => {
  if (!db) {
    db = new PGlite();
  }
  return db;
};

export const query = async (sql: string, params?: any[]) => {
  const instance = await getDb();
  return instance.query(sql, params);
};

export const exec = async (sql: string) => {
  const instance = await getDb();
  return instance.exec(sql);
};
