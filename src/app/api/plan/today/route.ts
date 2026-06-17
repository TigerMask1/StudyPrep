import { NextResponse } from 'next/server';
import { query } from '@/lib/config/database';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  if (!studentId) return NextResponse.json({ error: 'studentId required' }, { status: 400 });

  try {
    const result = await query(
      'SELECT * FROM "PlanAtom" WHERE "studentId" = $1 AND "date"::text = $2',
      [studentId, date]
    );
    return NextResponse.json(result.rows[0]?.data || null);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
