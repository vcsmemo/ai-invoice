import jsPDF from 'jspdf';
import { InvoiceData } from './supabase';
import { formatCurrency } from './currencies';

export async function generatePDF(invoiceData: InvoiceData, invoiceNumber: string): Promise<Buffer> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  const { from, customer, items, subtotal, tax, total, invoice, payment } = invoiceData;
  const currency = invoice.currency || 'USD';
  const halfWidth = (pageWidth - 3 * margin) / 2;

  // Calculate totals from items if not provided
  const calculatedSubtotal = items?.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0) || 0;
  const calculatedTotal = items?.reduce((sum, item) => sum + (item.total || (item.quantity || 0) * (item.unitPrice || 0)), 0) || 0;

  const validatedTotal = typeof total === 'number' ? total : calculatedTotal;
  const validatedSubtotal = typeof subtotal === 'number' ? subtotal : calculatedSubtotal;

  console.log('[PDF Generator] Total calculation:', {
    provided: total,
    calculated: calculatedTotal,
    validated: validatedTotal,
    itemCount: items?.length
  });

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Helper function to add text with wrapping
  const addText = (text: string, x: number, y: number, fontSize = 10, maxWidth: number) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.5) + 4;
  };

  // ========== HEADER SECTION ==========
  // Invoice title and number on the right
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth - margin, yPosition + 5, { align: 'right' });

  doc.setFontSize(14);
  doc.text(`#${invoice.invoiceNumber || invoiceNumber}`, pageWidth - margin, yPosition + 14, { align: 'right' });

  yPosition += 20;

  // ========== FROM & TO SIDE BY SIDE ==========
  // Left column - FROM
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128);
  doc.text('FROM', margin, yPosition);
  yPosition += 5;

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  if (from?.company) {
    doc.text(from.company.substring(0, 30), margin, yPosition);
    yPosition += 5;
  }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  if (from?.name) {
    doc.text(from.name, margin, yPosition);
    yPosition += 4;
  }
  if (from?.address) {
    yPosition = addText(from.address, margin, yPosition, 9, halfWidth);
  }
  if (from?.email) {
    doc.text(from.email, margin, yPosition);
    yPosition += 4;
  }

  // Right column - BILL TO
  let rightYPosition = yPosition - 25; // Start at same height as FROM
  const rightX = margin + halfWidth + margin;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128);
  doc.text('BILL TO', rightX, rightYPosition);
  rightYPosition += 5;

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(customer.name.substring(0, 30), rightX, rightYPosition);
  rightYPosition += 5;
  if (customer.company) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(customer.company, rightX, rightYPosition);
    rightYPosition += 4;
  }
  if (customer.address) {
    rightYPosition = addText(customer.address, rightX, rightYPosition, 9, halfWidth);
  }
  if (customer.email) {
    doc.setFontSize(9);
    doc.text(customer.email, rightX, rightYPosition);
    rightYPosition += 4;
  }

  yPosition = Math.max(yPosition, rightYPosition) + 8;

  // ========== DATES SIDE BY SIDE ==========
  checkPageBreak(30);

  const dateY = yPosition;
  let dateX = margin;
  const dateWidth = (pageWidth - 3 * margin) / 3;

  const addDateField = (label: string, value: string) => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(107, 114, 128);
    doc.text(label.toUpperCase(), dateX, dateY);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(value || '-', dateX, dateY + 6);

    dateX += dateWidth + margin;
  };

  addDateField('Invoice Date', invoice.issueDate);
  addDateField('Due Date', invoice.dueDate || '-');
  addDateField('Payment Terms', invoice.paymentTerms || '-');

  yPosition = dateY + 18;

  // ========== LINE ITEMS TABLE ==========
  checkPageBreak(80);

  // Table header
  const tableMargin = margin;
  const tableWidth = pageWidth - 2 * margin;
  const colWidths = {
    description: tableWidth * 0.50,
    qty: tableWidth * 0.12,
    price: tableWidth * 0.19,
    total: tableWidth * 0.19
  };

  doc.setFillColor(249, 250, 251);
  doc.rect(tableMargin, yPosition, tableWidth, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(55, 65, 81);

  let colX = tableMargin + 3;
  doc.text('DESCRIPTION', colX, yPosition + 5);
  colX += colWidths.description;
  doc.text('QTY', colX, yPosition + 5);
  colX += colWidths.qty;
  doc.text('PRICE', colX, yPosition + 5, { align: 'right' });
  colX += colWidths.price;
  doc.text('TOTAL', colX, yPosition + 5, { align: 'right' });

  yPosition += 8;

  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.1);

  items.forEach((item, index) => {
    checkPageBreak(15);

    if (index > 0) {
      doc.line(tableMargin, yPosition, tableMargin + tableWidth, yPosition);
    }
    yPosition += 5;

    const rowY = yPosition;

    // Description
    colX = tableMargin + 3;
    doc.text(item.description.substring(0, 60), colX, rowY);

    // Quantity
    colX += colWidths.description;
    doc.text(String(item.quantity), colX, rowY);

    // Price
    colX += colWidths.qty;
    const priceText = formatCurrency(item.unitPrice, currency);
    doc.text(priceText, colX + colWidths.price - 3, rowY, { align: 'right' });

    // Total
    colX += colWidths.price;
    const totalText = formatCurrency(item.total, currency);
    doc.text(totalText, colX + colWidths.total - 3, rowY, { align: 'right' });

    yPosition += 7;
  });

  // Bottom border
  doc.line(tableMargin, yPosition, tableMargin + tableWidth, yPosition);
  yPosition += 10;

  // ========== TOTALS SECTION ==========
  checkPageBreak(40);

  const totalsX = pageWidth - margin - 80;

  const addTotalRow = (label: string, value: string, isBold = false) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(label, totalsX, yPosition);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(isBold ? 11 : 9);
    doc.setTextColor(isBold ? 245 : 0, isBold ? 158 : 0, isBold ? 11 : 0);
    doc.text(value, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 6;
  };

  addTotalRow('Subtotal', formatCurrency(validatedSubtotal, currency));

  if (invoiceData.discount && invoiceData.discount.amount > 0) {
    const discountLabel = invoiceData.discount.percent
      ? `Discount (${invoiceData.discount.percent}%)`
      : 'Discount';
    addTotalRow(discountLabel, `-${formatCurrency(invoiceData.discount.amount, currency)}`);
  }

  if (tax && tax.rate > 0) {
    const taxLabel = tax.description ? `${tax.description} (${tax.rate}%)` : `Tax (${tax.rate}%)`;
    addTotalRow(taxLabel, formatCurrency(tax.amount, currency));
  }

  // Total with box
  yPosition += 3;
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.5);
  doc.line(totalsX, yPosition, pageWidth - margin, yPosition);
  yPosition += 3;

  doc.setFillColor(245, 158, 11);
  doc.rect(totalsX - 3, yPosition - 5, pageWidth - totalsX + margin - 3, 12, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  addTotalRow('TOTAL', formatCurrency(validatedTotal, currency), true);

  // ========== FOOTER NOTES ==========
  yPosition += 10;

  // Only add notes if there's enough space on the current page
  const spaceNeeded = (invoice.notes || payment?.instructions) ? 30 : 0;
  const currentPage = doc.internal.getNumberOfPages();

  if (yPosition + spaceNeeded < pageHeight - 25) {
    // Only show notes if they fit on the same page
    if (invoice.notes || (payment && payment.instructions)) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text('NOTES', margin, yPosition);
      yPosition += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(55, 65, 81);

      const notes = invoice.notes || '';
      const paymentInfo = payment?.instructions || '';
      const combinedNotes = [notes, paymentInfo].filter(Boolean).join('\n\n');
      yPosition = addText(combinedNotes, margin, yPosition, 8, pageWidth - 2 * margin);
    }
  }

  // ========== FOOTER ==========
  // Only add footer if there's enough space (at least 20px from bottom)
  // This prevents footer from appearing on a separate page
  if (yPosition < pageHeight - 20) {
    const footerY = Math.max(yPosition + 10, pageHeight - 15);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Generated by AI Invoice Generator | ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );
  }

  // Generate PDF as buffer
  const pdfBytes = await doc.output('arraybuffer');
  return Buffer.from(pdfBytes);
}
