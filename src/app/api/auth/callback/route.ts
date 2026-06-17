import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { profileService } from '@/lib/services/profileService';
import { planGenerator } from '@/lib/services/planGenerator';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const email = data.user.email!;
      const name = data.user.user_metadata.full_name || data.user.user_metadata.name || 'NEET Aspirant';

      // Sync with our Student table
      let student = await profileService.getByEmail(email);
      if (!student) {
        student = await profileService.create({
          name,
          email,
          class: 11,
          targetYear: 2027
        });
      }

      // Ensure they have a plan
      const plan = await planGenerator.generateDay(student, new Date());
      await planGenerator.savePlanAtom(student.id, plan);

      // Set cookie or session logic for the dashboard to pick up
      const response = NextResponse.redirect(`${origin}/dashboard`);
      // Use a custom header or query param for the dashboard to know which studentId to use
      // In this simple demo, we'll store it in a cookie that the dashboard can read
      response.cookies.set('studentId', student.id, { path: '/' });
      return response;
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
