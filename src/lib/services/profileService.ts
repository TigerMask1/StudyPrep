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
      return await prisma.student.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password || 'password123',
          class: data.class,
          targetYear: data.targetYear,
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
      console.error('profileService.getById error:', err.message);
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
