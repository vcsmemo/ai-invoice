import jsPDF from 'jspdf';
import { InvoiceData } from './supabase';
import { formatCurrency } from './currencies';

export async function generatePDF(invoiceData: InvoiceData, invoiceNumber: string): Promise<Buffer> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  const { from, customer, items, subtotal, tax, total, invoice, payment } = invoiceData;
  const currency = invoice.currency || 'USD';

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Helper function to add text with wrapping
  const addText = (text: string, x: number, y: number, fontSize = 10, maxWidth = pageWidth - 2 * margin) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.5) + 5;
  };

  // Header - Logo and Title
  doc.setFillColor(245, 158, 11);
  doc.rect(margin, yPosition, 20, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const initials = (from?.company || 'IN').substring(0, 2).toUpperCase();
  doc.text(initials, margin + 10, yPosition + 14, { align: 'center' });

  // Invoice title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice', margin, yPosition + 35);

  // Invoice number
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const invNum = `#${invoice.invoiceNumber || invoiceNumber}`;
  doc.text(invNum, margin, yPosition + 45);

  if (invoice.poNumber) {
    const poText = `PO: ${invoice.poNumber}`;
    doc.text(poText, margin, yPosition + 52);
  }

  // Total amount on the right
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Total Amount', pageWidth - margin, yPosition + 15, { align: 'right' });
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  const totalAmt = formatCurrency(total, currency);
  doc.text(totalAmt, pageWidth - margin, yPosition + 35, { align: 'right' });

  yPosition += 65;

  // From Section
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128);
  doc.text('FROM', margin, yPosition);
  yPosition += 7;

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  if (from?.company) {
    yPosition = addText(from.company, margin, yPosition, 12);
  }
  if (from?.name) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    yPosition = addText(from.name, margin, yPosition, 10);
  }
  if (from?.address) {
    yPosition = addText(from.address, margin, yPosition, 10);
  }
  if (from?.email || from?.phone) {
    const contact = [from.email, from.phone].filter(Boolean).join(' • ');
    yPosition = addText(contact, margin, yPosition, 10);
  }
  if (from?.website) {
    yPosition = addText(from.website, margin, yPosition, 10);
  }
  if (from?.taxId) {
    doc.setFontSize(9);
    const taxIdText = `Tax ID: ${from.taxId}`;
    yPosition = addText(taxIdText, margin, yPosition, 9);
  }

  // Bill To Section
  yPosition += 5;
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128);
  doc.text('BILL TO', margin, yPosition);
  yPosition += 7;

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  yPosition = addText(customer.name, margin, yPosition, 14);
  if (customer.company) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    yPosition = addText(customer.company, margin, yPosition, 12);
  }
  if (customer.address) {
    doc.setFontSize(10);
    yPosition = addText(customer.address, margin, yPosition, 10);
  }
  if (customer.email) {
    yPosition = addText(customer.email, margin, yPosition, 10);
  }

  // Line Items Table
  yPosition += 10;
  checkPageBreak(60);

  doc.setDrawColor(229, 231, 235);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128);
  doc.text('LINE ITEMS', margin, yPosition);
  yPosition += 8;

  // Table header
  const colWidths = { description: pageWidth - 2 * margin - 70, qty: 20, price: 25, total: 25 };
  const colX = {
    description: margin,
    qty: pageWidth - margin - 70,
    price: pageWidth - margin - 45,
    total: pageWidth - margin - 20
  };

  doc.setFillColor(249, 250, 251);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');
  yPosition += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(55, 65, 81);
  doc.text('DESCRIPTION', colX.description, yPosition);
  doc.text('QTY', colX.qty, yPosition, { align: 'center' });
  doc.text('PRICE', colX.price, yPosition, { align: 'right' });
  doc.text('TOTAL', colX.total, yPosition, { align: 'right' });

  yPosition += 8;

  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  items.forEach((item) => {
    checkPageBreak(20);

    doc.setDrawColor(229, 231, 235);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 7;

    // Description
    doc.text(item.description, colX.description, yPosition);
    if (item.sku) {
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      const skuText = `SKU: ${item.sku}`;
      yPosition = addText(skuText, colX.description, yPosition + 5, 8);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
    }

    // Quantity
    doc.text(String(item.quantity), colX.qty, yPosition, { align: 'center' });

    // Price
    const priceText = formatCurrency(item.unitPrice, currency);
    doc.text(priceText, colX.price, yPosition, { align: 'right' });

    // Total
    const totalText = formatCurrency(item.total, currency);
    doc.text(totalText, colX.total, yPosition, { align: 'right' });

    yPosition += 8;
  });

  // Bottom border
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);

  // Totals Section
  yPosition += 15;
  checkPageBreak(50);

  const totalsX = pageWidth - margin - 100;

  const addTotalRow = (label: string, value: string, isBold = false) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(label, totalsX, yPosition);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(10);
    doc.setTextColor(isBold ? 0 : 0, isBold ? 0 : 0, isBold ? 0 : 0);
    doc.text(value, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 8;
  };

  addTotalRow('Subtotal', formatCurrency(subtotal, currency));

  if (tax && tax.rate > 0) {
    const taxLabel = tax.description ? `${tax.description} (${tax.rate}%)` : `Tax (${tax.rate}%)`;
    addTotalRow(taxLabel, formatCurrency(tax.amount, currency));
  }

  // Total
  yPosition += 5;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(1);
  doc.line(totalsX, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  addTotalRow('Total', formatCurrency(total, currency), true);

  // Dates
  yPosition += 15;
  checkPageBreak(40);

  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);

  const addDate = (label: string, value: string) => {
    doc.text(label, margin, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(value, margin, yPosition + 7);
    yPosition += 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
  };

  addDate('Issue Date', invoice.issueDate);
  if (invoice.dueDate) {
    addDate('Due Date', invoice.dueDate);
  }
  if (invoice.paymentTerms) {
    addDate('Payment Terms', invoice.paymentTerms);
  }

  // Payment Information
  if (payment && (payment.instructions || payment.bankAccount || payment.paypalEmail)) {
    yPosition += 5;
    checkPageBreak(30);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text('PAYMENT INFORMATION', margin, yPosition);
    yPosition += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    if (payment.instructions) {
      yPosition = addText(payment.instructions, margin, yPosition, 10);
    }
    if (payment.bankAccount) {
      const bankText = `Bank Account: ${payment.bankAccount}`;
      yPosition = addText(bankText, margin, yPosition, 10);
    }
    if (payment.paypalEmail) {
      const paypalText = `PayPal: ${payment.paypalEmail}`;
      yPosition = addText(paypalText, margin, yPosition, 10);
    }
  }

  // Notes
  if (invoice.notes) {
    yPosition += 5;
    checkPageBreak(30);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text('NOTES', margin, yPosition);
    yPosition += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    yPosition = addText(invoice.notes, margin, yPosition, 10);
  }

  // Generate PDF as buffer
  const pdfBytes = await doc.output('arraybuffer');
  return Buffer.from(pdfBytes);
}
