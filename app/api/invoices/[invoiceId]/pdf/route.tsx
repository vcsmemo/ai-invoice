import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceById, updateUserCredits, getSupabaseAdmin, getProfile } from '@/lib/supabase';
import { generatePDF } from '@/lib/pdf-generator';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { invoiceId: string } }
) {
  try {
    const invoiceId = params.invoiceId;
    console.log('[PDF API] Generating PDF for invoice:', invoiceId);

    // Fetch invoice from database
    const invoice = await getInvoiceById(invoiceId);

    if (!invoice) {
      console.error('[PDF API] Invoice not found:', invoiceId);
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    console.log('[PDF API] Invoice found');
    console.log('[PDF API] Invoice number:', invoice.invoice_number);

    try {
      // Validate invoice data structure
      if (!invoice.invoice_data) {
        throw new Error('Missing invoice_data');
      }

      // Get user profile to supplement invoice data
      const profile = await getProfile(invoice.user_id);
      console.log('[PDF API] User profile loaded:', profile ? 'Yes' : 'No');

      // Deep clone invoice data to avoid mutation
      let invoiceData = JSON.parse(JSON.stringify(invoice.invoice_data));

      console.log('[PDF API] Original invoice data structure:', {
        hasCustomer: !!invoiceData.customer,
        hasFrom: !!invoiceData.from,
        hasItems: !!invoiceData.items?.length,
        hasTotal: typeof invoiceData.total === 'number',
        customerKeys: invoiceData.customer ? Object.keys(invoiceData.customer) : [],
        fromKeys: invoiceData.from ? Object.keys(invoiceData.from) : [],
      });

      // Merge profile data into invoice "from" field to ensure completeness
      if (profile) {
        console.log('[PDF API] Merging profile data into invoice data');
        console.log('[PDF API] Profile data:', {
          company_name: profile.company_name,
          logo_url: profile.logo_url,
          address: profile.address,
          phone: profile.phone,
          website: profile.website,
          tax_id: profile.tax_id,
        });

        // Always merge profile data to fill in missing fields
        invoiceData.from = {
          name: invoiceData.from?.name || '',  // Don't default to company_name
          email: invoiceData.from?.email || '',
          company: invoiceData.from?.company || profile.company_name || '',
          address: invoiceData.from?.address || profile.address || '',
          phone: invoiceData.from?.phone || profile.phone || '',
          website: invoiceData.from?.website || profile.website || '',
          taxId: invoiceData.from?.taxId || profile.tax_id || '',
          logo: invoiceData.from?.logo || profile.logo_url || '',
        };

        console.log('[PDF API] Merged from field:', {
          name: invoiceData.from.name,
          company: invoiceData.from.company,
          hasLogo: !!invoiceData.from.logo,
          hasAddress: !!invoiceData.from.address,
          hasPhone: !!invoiceData.from.phone,
          hasWebsite: !!invoiceData.from.website,
        });
      }

      console.log('[PDF API] Invoice data keys:', Object.keys(invoiceData));
      console.log('[PDF API] From field:', invoiceData.from ? Object.keys(invoiceData.from) : 'empty');
      console.log('[PDF API] Total:', invoiceData.total);
      console.log('[PDF API] Items:', invoiceData.items?.length);
      console.log('[PDF API] Creating PDF document using jsPDF...');

      const pdfBytes = await generatePDF(invoiceData, invoice.invoice_number);

      if (!pdfBytes || pdfBytes.length === 0) {
        throw new Error('PDF buffer is empty');
      }

      console.log('[PDF API] PDF generated successfully, size:', pdfBytes.length, 'bytes');

      // Deduct credit only after PDF is successfully generated
      // Check if we've already deducted credits for this invoice
      // We use the invoice status field to track this
      if (invoice.status === 'draft') {
        console.log('[PDF API] First time download, deducting credit for user:', invoice.user_id);
        await updateUserCredits(invoice.user_id, -1);

        // Update invoice status to 'sent' to indicate credits have been deducted
        const admin = getSupabaseAdmin();
        await admin
          .from('invoices')
          .update({ status: 'sent' })
          .eq('id', invoiceId);
        console.log('[PDF API] Invoice status updated to sent, credit deducted');
      } else {
        console.log('[PDF API] Invoice already downloaded (status:', invoice.status, '), skipping credit deduction');
      }

      // Return PDF as downloadable file
      return new NextResponse(new Uint8Array(pdfBytes), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${invoice.invoice_number}.pdf"`,
          'Content-Length': pdfBytes.length.toString(),
        },
      });
    } catch (pdfError: any) {
      console.error('[PDF API] PDF generation error:', pdfError);
      console.error('[PDF API] Error details:', {
        message: pdfError?.message,
        stack: pdfError?.stack,
        name: pdfError?.name,
      });
      return NextResponse.json(
        {
          error: 'Failed to generate PDF',
          details: pdfError?.message || 'Unknown PDF error',
          stack: pdfError?.stack?.substring(0, 500)
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[PDF API] General error:', error);
    console.error('[PDF API] Error stack:', error?.stack);
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error?.message || 'Unknown error',
        step: error?.message?.includes('invoice') ? 'fetching_invoice' : 'generating_pdf'
      },
      { status: 500 }
    );
  }
}
