import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    try {
      // Use upsert to be safe during OAuth callbacks
      return await prisma.student.upsert({
        where: { email: data.email },
        update: {
          name: data.name,
          class: data.class || 11,
          targetYear: data.targetYear || 2027,
        },
        create: {
          name: data.name,
          email: data.email,
          password: data.password || 'oauth_user',
          class: data.class || 11,
          targetYear: data.targetYear || 2027,
        }
      }) as unknown as StudentProfile;
    } catch (err: any) {
      console.error('profileService.create error:', err.message);
      throw err;
    }
  },

  async getById(id: string): Promise<StudentProfile | null> {
    try {
      return await prisma.student.findUnique({
        where: { id }
      }) as unknown as StudentProfile | null;
    } catch (err: any) {
      // Only log if it's not a missing ID
      if (id !== 'undefined' && id !== 'null') {
        console.error('profileService.getById error:', err.message);
      }
      return null;
    }
  },

  async getByEmail(email: string): Promise<StudentProfile | null> {
    try {
      return await prisma.student.findUnique({
        where: { email }
      }) as unknown as StudentProfile | null;
    } catch (err: any) {
      console.error('profileService.getByEmail error:', err.message);
      return null;
    }
  }
};
