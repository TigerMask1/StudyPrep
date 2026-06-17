import { NextResponse } from 'next/server';
import { profileService } from '@/lib/services/profileService';
import { planGenerator } from '@/lib/services/planGenerator';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Registering student:', data.email);
    const student = await profileService.create(data);
    console.log('Student created:', student.id);

    // Generate first day plan
    const today = new Date();
    const atom = await planGenerator.generateDay(student, today);
    console.log('Plan generated for day:', atom.date);
    await planGenerator.savePlanAtom(student.id, atom);
    console.log('Plan saved.');

    return NextResponse.json({ student, plan: atom });
  } catch (err: any) {
    console.error('Registration error details:', err);
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
