import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const amount = parseInt(searchParams.get('amount') || '100');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }

    console.log('[ADMIN] Adding', amount, 'credits to', email);

    const admin = getSupabaseAdmin();

    // Find user by email
    const { data: user, error: findError } = await admin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (findError || !user) {
      console.error('[ADMIN] User not found:', email, findError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('[ADMIN] Found user:', user.id, 'Current credits:', user.credits_remaining);

    // Update credits
    const { data: updatedUser, error: updateError } = await admin
      .from('users')
      .update({ credits_remaining: (user.credits_remaining || 0) + amount })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('[ADMIN] Error updating credits:', updateError);
      return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 });
    }

    console.log('[ADMIN] Success! New balance:', updatedUser.credits_remaining);

    return NextResponse.json({
      success: true,
      email,
      previousBalance: user.credits_remaining,
      added: amount,
      newBalance: updatedUser.credits_remaining,
    });
  } catch (error: any) {
    console.error('[ADMIN] Error:', error);
    return NextResponse.json(
      { error: 'Server error', details: error?.message },
      { status: 500 }
    );
  }
}
