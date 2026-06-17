import { NextResponse } from 'next/server';
import { query } from '@/lib/config/database';
import { planGenerator } from '@/lib/services/planGenerator';
import { profileService } from '@/lib/services/profileService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0];

    if (!studentId || studentId === 'undefined' || studentId === 'null') {
      return NextResponse.json({ error: 'Valid studentId required' }, { status: 400 });
    }

    // Use date cast for robustness
    const result = await query(
      'SELECT * FROM "PlanAtom" WHERE "studentId" = $1 AND "date"::date = $2::date',
      [studentId, dateStr]
    );

    if (result.rows.length > 0) {
      return NextResponse.json(result.rows[0].data);
    }

    const student = await profileService.getById(studentId);
    if (!student) {
      return NextResponse.json({ error: 'Student profile not found. Please re-register.' }, { status: 404 });
    }

    const newPlan = await planGenerator.generateDay(student, new Date(dateStr));
    await planGenerator.savePlanAtom(studentId, newPlan);

    return NextResponse.json(newPlan);
  } catch (err: any) {
    console.error('[API/Plan] Error:', err.message);
    return NextResponse.json({ error: `Plan system error: ${err.message}` }, { status: 500 });
  }
}
