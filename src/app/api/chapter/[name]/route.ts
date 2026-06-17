import { NextResponse } from 'next/server';
import { query } from '@/lib/config/database';

export async function GET(req: Request, { params }: { params: Promise<{ name: string }> }) {
  try {
    const { name } = await params;
    const chapterName = decodeURIComponent(name);
    const studentId = new URL(req.url).searchParams.get('studentId');

    const sql = "SELECT s.*, st.status, st.performance, st.lastAttempted FROM \"Subtopic\" s LEFT JOIN \"StudentSubtopicStatus\" st ON s.id = st.\"subtopicId\" AND st.\"studentId\" = $1 WHERE s.chapter = $2 ORDER BY s.id ASC";
    const result = await query(sql, [studentId, chapterName]);

    return NextResponse.json({
      chapter: chapterName,
      subtopics: result.rows
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
