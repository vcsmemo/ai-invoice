import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getProfile } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const profile = await getProfile(session.user.id);

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
      },
      profile: {
        exists: !!profile,
        companyName: profile?.company_name,
        autoEmailInvoices: profile?.auto_email_invoices,
        CcMeOnInvoices: profile?.cc_me_on_invoices,
        // Check if fields exist in database
        hasAutoEmailField: profile && 'auto_email_invoices' in profile,
        hasCcMeField: profile && 'cc_me_on_invoices' in profile,
      },
      environment: {
        resendApiKeySet: !!process.env.RESEND_API_KEY,
        emailFrom: process.env.EMAIL_FROM,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
