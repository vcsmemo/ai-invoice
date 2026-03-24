import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getOrCreateProfile, updateProfile } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const profile = await getOrCreateProfile(session.user.id);

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.error('[Profile API] No session found');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    console.log('[Profile API] Updating profile for user:', session.user.id);

    const body = await request.json();
    console.log('[Profile API] Request body:', body);

    // Validate numeric fields
    if (body.default_tax_rate !== undefined) {
      body.default_tax_rate = parseFloat(body.default_tax_rate) || 0;
    }

    console.log('[Profile API] Calling updateProfile with:', body);
    const profile = await updateProfile(session.user.id, body);
    console.log('[Profile API] Update result:', profile);

    if (!profile) {
      console.error('[Profile API] updateProfile returned null');
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      profile,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('[Profile API] Error updating profile:', error);
    console.error('[Profile API] Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    return NextResponse.json(
      { error: 'Failed to update profile', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
