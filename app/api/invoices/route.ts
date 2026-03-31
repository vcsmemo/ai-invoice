import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  createInvoice,
  generateInvoiceNumber,
  checkUserCredits,
  updateUserCredits,
  getProfile,
  updateInvoiceStatus,
} from '@/lib/supabase';
import { InvoiceData } from '@/lib/supabase';
import { sendInvoiceEmail } from '@/lib/email';
import { generatePDF } from '@/lib/pdf-generator';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('[Invoice API] Creating invoice...');

    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.log('[Invoice API] Authentication failed');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('[Invoice API] User authenticated:', session.user.id);

    // Check if user has credits
    const hasCredits = await checkUserCredits(session.user.id);
    console.log('[Invoice API] User has credits:', hasCredits);

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
      console.log('[Invoice API] Missing invoice data');
      return NextResponse.json(
        { error: 'Invoice data is required' },
        { status: 400 }
      );
    }

    console.log('[Invoice API] Invoice data received, generating number...');

    // Generate invoice number using user-specific format
    const invoiceNumber = await generateInvoiceNumber(session.user.id);
    console.log('[Invoice API] Invoice number generated:', invoiceNumber);

    // Create invoice in database
    const invoice = await createInvoice(
      session.user.id,
      invoiceNumber,
      invoiceData
    );

    if (!invoice) {
      console.error('[Invoice API] Failed to create invoice in database');
      return NextResponse.json(
        { error: 'Failed to create invoice' },
        { status: 500 }
      );
    }

    console.log('[Invoice API] Invoice created in database:', invoice.id);
    console.log('[Invoice API] Invoice data structure:', {
      hasCustomer: !!invoiceData.customer,
      customerEmail: invoiceData.customer?.email,
      hasItems: !!invoiceData.items?.length,
      total: invoiceData.total,
    });

    // Note: Credits will be deducted after PDF is successfully generated
    // This ensures users are only charged when PDF download is successful

    // Optional: Send email if auto-send is enabled
    let emailResult: { sentToClient?: boolean; sentCc?: boolean; error?: string } = {};

    try {
      const profile = await getProfile(session.user.id);

      console.log('[Invoice API] Email preferences check:');
      console.log('[Invoice API] - Profile exists:', !!profile);
      console.log('[Invoice API] - auto_email_invoices:', profile?.auto_email_invoices);
      console.log('[Invoice API] - cc_me_on_invoices:', profile?.cc_me_on_invoices);
      console.log('[Invoice API] - Customer email:', invoiceData.customer?.email);
      console.log('[Invoice API] - RESEND_API_KEY set:', !!process.env.RESEND_API_KEY);
      console.log('[Invoice API] - EMAIL_FROM:', process.env.EMAIL_FROM);

      if (profile?.auto_email_invoices && invoiceData.customer?.email) {
        console.log('[Invoice API] ✅ Auto-send enabled, generating PDF and sending email...');

        // Generate PDF for email attachment
        const pdfBuffer = await generatePDF(invoiceData, invoiceNumber);

        // Prepare CC email
        const ccEmail = profile.cc_me_on_invoices ? session.user.email : undefined;

        console.log('[Invoice API] Sending email...');
        console.log('[Invoice API] - To:', invoiceData.customer.email);
        console.log('[Invoice API] - CC:', ccEmail || 'none');
        console.log('[Invoice API] - From:', process.env.EMAIL_FROM || 'noreply@aiinvoicegenerators.com');

        // Send email
        const emailResponse = await sendInvoiceEmail({
          to: invoiceData.customer.email,
          cc: ccEmail,
          invoiceData,
          invoiceNumber,
          pdfBuffer,
          fromEmail: process.env.EMAIL_FROM || 'noreply@aiinvoicegenerators.com',
          fromName: profile.company_name || undefined,
        });

        if (emailResponse.success) {
          console.log('[Invoice API] Email sent successfully');
          emailResult = {
            sentToClient: true,
            sentCc: !!ccEmail,
          };

          // Update invoice status to 'sent'
          await updateInvoiceStatus(invoice.id, 'sent');
        } else {
          console.error('[Invoice API] Email sending failed:', emailResponse.error);
          emailResult = {
            sentToClient: false,
            sentCc: false,
            error: emailResponse.error,
          };
          // Don't fail the request - invoice was created successfully
        }
      } else {
        console.log('[Invoice API] ⚠️ Email not sent - conditions not met:');
        console.log('[Invoice API] - auto_email_invoices:', profile?.auto_email_invoices);
        console.log('[Invoice API] - customer.email:', invoiceData.customer?.email);
        emailResult = {
          sentToClient: false,
          sentCc: false,
          error: profile?.auto_email_invoices
            ? 'Customer email is required for auto-send'
            : 'Auto-send is disabled in Settings',
        };
      }
    } catch (emailError) {
      console.error('[Invoice API] Error in email sending flow:', emailError);
      // Don't fail the request - invoice was created successfully
      emailResult = {
        sentToClient: false,
        sentCc: false,
        error: emailError instanceof Error ? emailError.message : 'Unknown error',
      };
    }

    return NextResponse.json({
      success: true,
      invoice,
      message: 'Invoice created successfully',
      email: emailResult,
    });
  } catch (error) {
    console.error('[Invoice API] Error creating invoice:', error);
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
