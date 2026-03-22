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

    // Fetch invoice from database
    const invoice = await getInvoiceById(invoiceId);

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Generate PDF
    const pdfDoc = pdf(
      <InvoicePDF
        invoiceData={invoice.invoice_data}
        invoiceNumber={invoice.invoice_number}
      />
    );

    const pdfBytes = await pdfDoc.toBuffer();

    // Return PDF as downloadable file
    return new NextResponse(pdfBytes as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.invoice_number}.pdf"`,
        'Content-Length': (pdfBytes as any).length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
