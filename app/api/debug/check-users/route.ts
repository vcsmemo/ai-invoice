import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const admin = getSupabaseAdmin();

    // Get all users
    const { data: users, error: usersError } = await admin
      .from('users')
      .select('id, email, credits_remaining, created_at');

    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    // Get all profiles
    const { data: profiles, error: profilesError } = await admin
      .from('profiles')
      .select('*');

    if (profilesError) {
      return NextResponse.json({ error: profilesError.message }, { status: 500 });
    }

    return NextResponse.json({
      usersCount: users?.length || 0,
      users: users,
      profilesCount: profiles?.length || 0,
      profiles: profiles,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Debug failed', details: error?.message },
      { status: 500 }
    );
  }
}
