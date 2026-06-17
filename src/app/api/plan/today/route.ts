import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { planGenerator } from '@/lib/services/planGenerator';
import { profileService } from '@/lib/services/profileService';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0];

    if (!studentId || studentId === 'undefined' || studentId === 'null') {
      return NextResponse.json({ error: 'Valid studentId required' }, { status: 400 });
    }

    const date = new Date(dateStr);
    const existing = await prisma.planAtom.findUnique({
      where: {
        studentId_date: {
          studentId,
          date
        }
      }
    });

    if (existing) {
      return NextResponse.json(existing.data);
    }

    const student = await profileService.getById(studentId);
    if (!student) {
      return NextResponse.json({ error: 'Student profile not found. Please re-register.' }, { status: 404 });
    }

    const newPlan = await planGenerator.generateDay(student, date);
    await planGenerator.savePlanAtom(studentId, newPlan);

    return NextResponse.json(newPlan);
  } catch (err: any) {
    console.error('[API/Plan] Error:', err.message);
    return NextResponse.json({ error: `Plan system error: ${err.message}` }, { status: 500 });
  }
}
