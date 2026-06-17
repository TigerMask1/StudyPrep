import { NextResponse } from 'next/server';
import { query } from '@/lib/config/database';

export async function GET() {
  try {
    const res = await query('SELECT NOW()');
    return NextResponse.json({ status: 'ok', time: res.rows[0].now });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
