import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceById } from '@/lib/supabase';
import { pdf, StyleSheet, Document, Page } from '@react-pdf/renderer';

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

      console.log('[PDF API] Invoice data keys:', Object.keys(invoice.invoice_data));

      // Import PDF component dynamically to avoid build issues
      const { default: InvoicePDF } = await import('@/components/InvoicePDF');

      console.log('[PDF API] Creating PDF document...');

      // Create PDF document
      const pdfDoc = pdf(
        <InvoicePDF
          invoiceData={invoice.invoice_data}
          invoiceNumber={invoice.invoice_number}
        />
      );

      console.log('[PDF API] Rendering to buffer...');
      const pdfBytes = await pdfDoc.toBuffer();

      if (!pdfBytes || pdfBytes.length === 0) {
        throw new Error('PDF buffer is empty');
      }

      console.log('[PDF API] PDF generated successfully, size:', pdfBytes.length, 'bytes');

      // Return PDF as downloadable file
      return new NextResponse(Buffer.from(pdfBytes), {
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
