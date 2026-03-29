import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getInvoiceById, getProfile, updateInvoiceStatus } from '@/lib/supabase';
import { sendInvoiceEmail } from '@/lib/email';
import { generatePDF } from '@/lib/pdf-generator';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { invoiceId: string } }
) {
  try {
    console.log('[Invoice Send API] Sending invoice:', params.invoiceId);

    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.log('[Invoice Send API] Authentication failed');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Fetch invoice
    const invoice = await getInvoiceById(params.invoiceId);

    if (!invoice) {
      console.log('[Invoice Send API] Invoice not found');
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (invoice.user_id !== session.user.id) {
      console.log('[Invoice Send API] Access denied: wrong user');
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const invoiceData = invoice.invoice_data;

    // Validate client email
    if (!invoiceData.customer?.email) {
      return NextResponse.json(
        { error: 'Client email is required to send invoice' },
        { status: 400 }
      );
    }

    // Fetch user profile for CC preference
    const profile = await getProfile(session.user.id);

    // Generate PDF for email attachment
    console.log('[Invoice Send API] Generating PDF...');
    const pdfBuffer = await generatePDF(invoiceData, invoice.invoice_number);

    // Prepare CC email
    const ccEmail = profile?.cc_me_on_invoices ? session.user.email : undefined;

    // Send email
    console.log('[Invoice Send API] Sending email...');
    const result = await sendInvoiceEmail({
      to: invoiceData.customer.email,
      cc: ccEmail,
      invoiceData,
      invoiceNumber: invoice.invoice_number,
      pdfBuffer,
      fromEmail: process.env.EMAIL_FROM || 'noreply@aiinvoicegenerators.com',
      fromName: profile?.company_name || undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Failed to send email',
          details: result.error,
        },
        { status: 500 }
      );
    }

    // Update invoice status to 'sent'
    await updateInvoiceStatus(invoice.id, 'sent');

    console.log('[Invoice Send API] Email sent successfully');

    return NextResponse.json({
      success: true,
      message: 'Invoice sent successfully',
      sentTo: invoiceData.customer.email,
      sentCc: ccEmail || false,
    });
  } catch (error) {
    console.error('[Invoice Send API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to send invoice' },
      { status: 500 }
    );
  }
}
