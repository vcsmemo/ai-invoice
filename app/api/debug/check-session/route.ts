import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserByEmail, getProfile, getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const email = session.user.email;
    const sessionId = session.user.id;

    console.log('[DEBUG] Session info:', { email, sessionId });

    // Check if user exists in database
    const dbUser = await getUserByEmail(email || '');
    console.log('[DEBUG] Database user:', dbUser);

    // Check if profile exists
    let profile = null;
    if (dbUser) {
      profile = await getProfile(dbUser.id);
      console.log('[DEBUG] Profile:', profile);
    }

    // Check profiles table directly
    const admin = getSupabaseAdmin();
    const { data: allProfiles } = await admin
      .from('profiles')
      .select('*');
    console.log('[DEBUG] All profiles:', allProfiles);

    return NextResponse.json({
      session: {
        email: session.user.email,
        id: sessionId,
        name: session.user.name,
      },
      databaseUser: dbUser ? {
        id: dbUser.id,
        email: dbUser.email,
        credits: dbUser.credits_remaining,
      } : null,
      profile: profile,
      allProfilesCount: allProfiles?.length || 0,
      idsMatch: dbUser ? dbUser.id === sessionId : false,
    });
  } catch (error: any) {
    console.error('[DEBUG] Error:', error);
    return NextResponse.json(
      { error: 'Debug failed', details: error?.message },
      { status: 500 }
    );
  }
}
