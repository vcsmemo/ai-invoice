import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceById } from '@/lib/supabase';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from '@/components/InvoicePDF';

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

    console.log('[PDF API] Invoice found, data:', JSON.stringify(invoice).substring(0, 200));

    try {
      console.log('[PDF API] Creating PDF document...');
      // Generate PDF
      const pdfDoc = pdf(
        <InvoicePDF
          invoiceData={invoice.invoice_data}
          invoiceNumber={invoice.invoice_number}
        />
      );

      console.log('[PDF API] Converting to buffer...');
      const pdfBytes = await pdfDoc.toBuffer();

      console.log('[PDF API] PDF generated successfully, size:', (pdfBytes as any).length, 'bytes');

      // Return PDF as downloadable file
      return new NextResponse(pdfBytes as any, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${invoice.invoice_number}.pdf"`,
          'Content-Length': (pdfBytes as any).length.toString(),
        },
      });
    } catch (pdfError: any) {
      console.error('[PDF API] PDF generation error:', pdfError);
      console.error('[PDF API] Error stack:', pdfError?.stack);
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
