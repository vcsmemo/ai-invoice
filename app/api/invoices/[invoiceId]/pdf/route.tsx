import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceById } from '@/lib/supabase';
import { pdf } from '@react-pdf/renderer';
import React from 'react';

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
      console.log('[PDF API] Creating PDF document...');

      // Dynamic import to avoid build issues with @react-pdf/renderer
      const { default: InvoicePDF } = await import('@/components/InvoicePDF');

      // Create PDF document using React.createElement with type assertion
      const element = React.createElement(InvoicePDF, {
        invoiceData: invoice.invoice_data,
        invoiceNumber: invoice.invoice_number
      });
      const pdfDoc = pdf(element as any);

      console.log('[PDF API] Rendering to buffer...');
      const pdfBytes = await pdfDoc.toBuffer();

      if (!pdfBytes || (pdfBytes as any).length === 0) {
        throw new Error('PDF buffer is empty');
      }

      console.log('[PDF API] PDF generated successfully, size:', (pdfBytes as any).length, 'bytes');

      // Return PDF as downloadable file
      return new NextResponse(Buffer.from(pdfBytes as any), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${invoice.invoice_number}.pdf"`,
          'Content-Length': (pdfBytes as any).length.toString(),
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
