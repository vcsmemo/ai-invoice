import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getOrCreateProfile, getSupabaseAdmin } from '@/lib/supabase';

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

    console.log('[Profile API] Calling Supabase update with updates');

    // Direct Supabase call to get detailed error information
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('profiles')
      .update(updates)
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) {
      console.error('[Profile API] Supabase update error:', error);
      console.error('[Profile API] Full error object:', JSON.stringify(error, null, 2));

      return NextResponse.json(
        {
          error: 'Failed to update profile',
          details: error.message,
          code: error.code,
          hint: error.hint,
          details_full: JSON.stringify(error, null, 2)
        },
        { status: 500 }
      );
    }

    if (!data) {
      console.error('[Profile API] Update returned no data');
      return NextResponse.json(
        { error: 'Failed to update profile', details: 'No data returned from update' },
        { status: 500 }
      );
    }

    console.log('[Profile API] Update successful:', data);

    return NextResponse.json({
      success: true,
      profile: data,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('[Profile API] Exception caught:', error);
    console.error('[Profile API] Error stack:', error?.stack);
    return NextResponse.json(
      {
        error: 'Failed to update profile',
        details: error?.message || 'Unknown error',
        stack: error?.stack?.substring(0, 500)
      },
      { status: 500 }
    );
  }
}
