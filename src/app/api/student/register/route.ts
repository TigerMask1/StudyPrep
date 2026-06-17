import { NextResponse } from 'next/server';
import { profileService } from '@/lib/services/profileService';
import { planGenerator } from '@/lib/services/planGenerator';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 400 });
    }

    const body = await req.json();

    if (body.id && Object.keys(body).length === 1) {
      const student = await profileService.getById(body.id);
      if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      return NextResponse.json({ student });
    }

    const { name, email, password, class: studentClass, targetYear } = body;
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    console.log(`[API/Register] email: ${email}`);

    // Check if already exists
    let student = await profileService.getByEmail(email);

    if (!student) {
      student = await profileService.create({
        name: name || 'NEET Aspirant',
        email,
        password: password || 'password123',
        class: studentClass || 11,
        targetYear: targetYear || 2027
      });
      console.log(`[API/Register] New student created: ${student.id}`);
    } else {
      console.log(`[API/Register] Existing student found: ${student.id}`);
    }

    const plan = await planGenerator.generateDay(student, new Date());
    await planGenerator.savePlanAtom(student.id, plan);

    return NextResponse.json({ student, plan });
  } catch (err: any) {
    console.error('[API/Register] Fatal error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
