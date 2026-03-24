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
    console.log('[Profile API] Request body keys:', Object.keys(body));
    console.log('[Profile API] Request body:', JSON.stringify(body, null, 2));

    // Filter out readonly fields and empty strings
    const allowedFields = [
      'company_name',
      'logo_url',
      'address',
      'phone',
      'website',
      'tax_id',
      'payment_instructions',
      'default_currency',
      'default_tax_rate',
      'invoice_prefix',
      'payment_terms',
    ];

    const updates: any = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        // Convert empty strings to null for text fields
        if (typeof body[field] === 'string' && body[field].trim() === '') {
          updates[field] = null;
        } else if (field === 'default_tax_rate') {
          // Validate numeric field
          updates[field] = parseFloat(body[field]) || 0;
        } else {
          updates[field] = body[field];
        }
      }
    }

    console.log('[Profile API] Filtered updates:', JSON.stringify(updates, null, 2));

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No fields to update',
      });
    }

    console.log('[Profile API] Calling updateProfile with updates');
    const profile = await updateProfile(session.user.id, updates);
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
      code: error?.code,
      hint: error?.hint,
      details: error?.details,
    });
    return NextResponse.json(
      {
        error: 'Failed to update profile',
        details: error?.message || 'Unknown error',
        ...(error?.hint && { hint: error.hint })
      },
      { status: 500 }
    );
  }
}
