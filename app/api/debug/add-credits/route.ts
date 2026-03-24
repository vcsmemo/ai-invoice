import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updateUserCredits, getUserByEmail } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { amount } = body;

    if (typeof amount !== 'number') {
      return NextResponse.json({ error: 'Amount must be a number' }, { status: 400 });
    }

    if (amount > 100) {
      return NextResponse.json({ error: 'Maximum 100 credits at once' }, { status: 400 });
    }

    console.log('[DEBUG] Adding', amount, 'credits to user:', session.user.email);

    const user = await getUserByEmail(session.user.email || '');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = await updateUserCredits(user.id, amount);

    console.log('[DEBUG] Credits updated. New balance:', updatedUser?.credits_remaining);

    return NextResponse.json({
      success: true,
      previousBalance: user.credits_remaining,
      added: amount,
      newBalance: updatedUser?.credits_remaining || 0,
    });
  } catch (error: any) {
    console.error('[DEBUG] Error adding credits:', error);
    return NextResponse.json(
      { error: 'Failed to add credits', details: error?.message },
      { status: 500 }
    );
  }
}
