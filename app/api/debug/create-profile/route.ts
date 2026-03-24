import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = session.user.id;
    console.log('[DEBUG] Creating profile for user:', userId);

    const admin = getSupabaseAdmin();

    // Check if profile already exists
    const { data: existingProfile } = await admin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      console.log('[DEBUG] Profile already exists:', existingProfile);
      return NextResponse.json({
        success: true,
        message: 'Profile already exists',
        profile: existingProfile,
      });
    }

    // Create profile
    const newProfile = {
      id: userId,
      default_currency: 'USD',
      default_tax_rate: 0,
      invoice_prefix: 'INV',
      payment_terms: 'Net 30',
    };

    console.log('[DEBUG] Creating profile with data:', newProfile);

    const { data, error } = await admin
      .from('profiles')
      .insert(newProfile)
      .select()
      .single();

    if (error) {
      console.error('[DEBUG] Error creating profile:', error);
      console.error('[DEBUG] Full error:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          error: 'Failed to create profile',
          details: error.message,
          code: error.code,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    console.log('[DEBUG] Profile created successfully:', data);

    return NextResponse.json({
      success: true,
      message: 'Profile created successfully',
      profile: data,
    });
  } catch (error: any) {
    console.error('[DEBUG] Exception:', error);
    return NextResponse.json(
      { error: 'Server error', details: error?.message, stack: error?.stack?.substring(0, 500) },
      { status: 500 }
    );
  }
}
