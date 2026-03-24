import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserByEmail, getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const admin = getSupabaseAdmin();
    const email = session.user.email;

    console.log('[FIX] Starting profile fix for email:', email);

    // Step 1: Get user from database
    const { data: user } = await admin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    console.log('[FIX] Found user:', user.id);

    // Step 2: Check if profile exists
    const { data: existingProfile } = await admin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      console.log('[FIX] Profile already exists');
      return NextResponse.json({
        success: true,
        message: 'Profile already exists',
        profile: existingProfile,
      });
    }

    // Step 3: Try using raw SQL to bypass any RLS issues
    const { data: newProfile, error: insertError } = await admin.rpc('create_profile_for_user', {
      p_user_id: user.id,
      p_default_currency: 'USD',
      p_default_tax_rate: 0,
      p_invoice_prefix: 'INV',
      p_payment_terms: 'Net 30',
    });

    if (insertError) {
      console.log('[FIX] RPC failed, trying direct insert');

      // Fallback: Try direct insert without using the user.id from session
      const profileData = {
        id: user.id,
        default_currency: 'USD',
        default_tax_rate: 0,
        invoice_prefix: 'INV',
        payment_terms: 'Net 30',
      };

      console.log('[FIX] Inserting profile:', profileData);

      const { data: profile, error: directError } = await admin
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (directError) {
        console.error('[FIX] Direct insert also failed:', directError);

        // Last resort: Create a new user with proper profile
        console.log('[FIX] Last resort: Checking if we need to recreate user');

        return NextResponse.json({
          error: 'Cannot create profile due to foreign key constraint',
          details: directError.message,
          code: directError.code,
          hint: 'The user ID in session may not match the user ID in database. Try signing out and signing back in.',
          userId: user.id,
          sessionId: session.user.id,
          idsMatch: user.id === session.user.id,
        }, { status: 500 });
      }

      console.log('[FIX] Profile created via direct insert:', profile);

      return NextResponse.json({
        success: true,
        message: 'Profile created successfully',
        profile,
      });
    }

    console.log('[FIX] Profile created via RPC:', newProfile);

    return NextResponse.json({
      success: true,
      message: 'Profile created successfully',
      profile: newProfile,
    });
  } catch (error: any) {
    console.error('[FIX] Exception:', error);
    return NextResponse.json(
      { error: 'Server error', details: error?.message, stack: error?.stack?.substring(0, 500) },
      { status: 500 }
    );
  }
}
