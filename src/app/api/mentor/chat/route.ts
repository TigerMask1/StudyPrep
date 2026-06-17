import { NextResponse } from 'next/server';
import { aiMentorService } from '@/lib/services/aiMentor';

export async function POST(req: Request) {
  try {
    const { studentId, message, history } = await req.json();
    const response = await aiMentorService.chat(studentId, message, history || []);
    return NextResponse.json({ response });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
