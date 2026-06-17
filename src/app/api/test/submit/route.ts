import { NextResponse } from 'next/server';
import { eventReactor } from '@/lib/services/eventReactor';

export async function POST(req: Request) {
  try {
    const { studentId, testResult } = await req.json();
    // testResult should contain weakSubtopics: [{id: ...}]
    await eventReactor.handleTestResult(studentId, testResult);
    return NextResponse.json({ success: true, message: 'Plan updated based on test performance' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
