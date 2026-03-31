import { NextResponse } from 'next/server';
import { generatePDF } from '@/lib/pdf-generator';
import { sampleInvoice } from '@/lib/sample-invoice';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('[Sample PDF] Generating sample invoice PDF...');

    // Generate invoice number for sample
    const invoiceNumber = `SAMPLE-${Date.now()}`;

    // Generate PDF from sample invoice data
    const pdfBuffer = await generatePDF(sampleInvoice, invoiceNumber);

    console.log('[Sample PDF] PDF generated successfully, size:', pdfBuffer.length);

    // Return PDF as downloadable file
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="sample-invoice.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('[Sample PDF] Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate sample PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
