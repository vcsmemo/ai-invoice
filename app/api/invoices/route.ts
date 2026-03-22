import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  createInvoice,
  generateInvoiceNumber,
  checkUserCredits,
  updateUserCredits,
} from '@/lib/supabase';
import { InvoiceData } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has credits
    const hasCredits = await checkUserCredits(session.user.id);

    if (!hasCredits) {
      return NextResponse.json(
        { error: 'No credits remaining. Please purchase more credits to continue.' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { invoiceData } = body as { invoiceData: InvoiceData };

    if (!invoiceData) {
      return NextResponse.json(
        { error: 'Invoice data is required' },
        { status: 400 }
      );
    }

    // Generate invoice number using user-specific format
    const invoiceNumber = await generateInvoiceNumber(session.user.id);

    // Create invoice in database
    const invoice = await createInvoice(
      session.user.id,
      invoiceNumber,
      invoiceData
    );

    if (!invoice) {
      return NextResponse.json(
        { error: 'Failed to create invoice' },
        { status: 500 }
      );
    }

    // Deduct credit
    await updateUserCredits(session.user.id, -1);

    return NextResponse.json({
      success: true,
      invoice,
      message: 'Invoice created successfully',
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // This endpoint is for fetching user's invoices
    // But we'll implement that in the /my-invoices page
    return NextResponse.json({ error: 'Use /my-invoices endpoint' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
