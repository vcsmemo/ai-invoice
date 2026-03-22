import jsPDF from 'jspdf'
import { InvoiceData } from './types'
import { countries } from './countries'

export async function generatePDF(invoice: InvoiceData, withWatermark: boolean = false) {
  const doc = new jsPDF()
  const country = countries[invoice.country]
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 20

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage()
      yPosition = 20
    }
  }

  // Header
  doc.setFillColor(37, 99, 235) // Primary color
  doc.rect(0, 0, pageWidth, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE', pageWidth / 2, 25, { align: 'center' })

  yPosition = 50

  // Invoice Info
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 20, yPosition)
  doc.text(`Date: ${invoice.date}`, 20, yPosition + 7)
  doc.text(`Due Date: ${invoice.dueDate}`, 20, yPosition + 14)

  doc.text(`${country.flag} ${country.name}`, pageWidth - 20, yPosition, { align: 'right' })
  doc.text(`${country.currency}`, pageWidth - 20, yPosition + 7, { align: 'right' })

  yPosition += 30

  // From & To
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('From:', 20, yPosition)
  doc.text('To:', pageWidth / 2 + 20, yPosition)

  yPosition += 7

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  // From details
  doc.text(invoice.from.name || '', 20, yPosition)
  yPosition += 6
  if (invoice.from.email) {
    doc.text(invoice.from.email, 20, yPosition)
    yPosition += 6
  }
  if (invoice.from.address) {
    const addressLines = doc.splitTextToSize(invoice.from.address, 80)
    doc.text(addressLines, 20, yPosition)
    yPosition += addressLines.length * 5
  }
  if (invoice.from.phone) {
    doc.text(invoice.from.phone, 20, yPosition)
    yPosition += 6
  }

  // To details
  const toYPosition = yPosition - (invoice.from.address ? 30 : 18)
  doc.text(invoice.to.name || '', pageWidth / 2 + 20, toYPosition)
  if (invoice.to.email) {
    doc.text(invoice.to.email, pageWidth / 2 + 20, toYPosition + 6)
  }
  if (invoice.to.address) {
    const addressLines = doc.splitTextToSize(invoice.to.address, 80)
    doc.text(addressLines, pageWidth / 2 + 20, toYPosition + 12)
  }

  yPosition += 15

  // Line Items
  checkPageBreak(60)

  const tableTop = yPosition
  const colWidths = [pageWidth - 120, 40, 50, 30]

  // Table header
  doc.setFillColor(243, 244, 246)
  doc.rect(20, yPosition, pageWidth - 40, 10, 'F')

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Description', 25, yPosition + 7)
  doc.text('Qty', 25 + colWidths[0], yPosition + 7)
  doc.text('Rate', 25 + colWidths[0] + colWidths[1], yPosition + 7)
  doc.text('Amount', pageWidth - 25, yPosition + 7, { align: 'right' })

  yPosition += 10

  // Items
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)

  invoice.items.forEach((item, index) => {
    checkPageBreak(20)

    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251)
      doc.rect(20, yPosition, pageWidth - 40, 8, 'F')
    }

    doc.text(item.description || '', 25, yPosition + 6)
    doc.text(item.quantity.toString(), 25 + colWidths[0], yPosition + 6)
    doc.text(item.rate.toFixed(2), 25 + colWidths[0] + colWidths[1], yPosition + 6)
    doc.text(item.amount.toFixed(2), pageWidth - 25, yPosition + 6, { align: 'right' })

    yPosition += 8
  })

  yPosition += 10

  // Totals
  checkPageBreak(40)

  const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0)
  const tax = subtotal * (invoice.taxRate / 100)
  const total = subtotal + tax

  const totalsX = pageWidth - 100
  const totalsWidth = 80

  // Subtotal
  doc.setDrawColor(229, 231, 235)
  doc.line(totalsX, yPosition, totalsX + totalsWidth, yPosition)
  yPosition += 7

  doc.setFontSize(10)
  doc.text('Subtotal:', totalsX, yPosition)
  doc.text(subtotal.toFixed(2), totalsX + totalsWidth, yPosition, { align: 'right' })

  yPosition += 7

  doc.text(`${country.taxLabel} (${invoice.taxRate}%):`, totalsX, yPosition)
  doc.text(tax.toFixed(2), totalsX + totalsWidth, yPosition, { align: 'right' })

  yPosition += 7

  doc.line(totalsX, yPosition, totalsX + totalsWidth, yPosition)
  yPosition += 7

  // Total
  doc.setFillColor(37, 99, 235)
  doc.rect(totalsX - 5, yPosition - 5, totalsWidth + 10, 12, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Total:', totalsX, yPosition + 3)
  doc.text(total.toFixed(2), totalsX + totalsWidth, yPosition + 3, { align: 'right' })

  doc.setTextColor(0, 0, 0)

  yPosition += 20

  // Notes
  if (invoice.notes) {
    checkPageBreak()

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text('Notes:', 20, yPosition)
    yPosition += 6

    const notesLines = doc.splitTextToSize(invoice.notes, pageWidth - 40)
    doc.text(notesLines, 20, yPosition)
    yPosition += notesLines.length * 5
  }

  // Watermark for free users
  if (withWatermark) {
    doc.setTextColor(200, 200, 200)
    doc.setFontSize(40)
    doc.setFont('helvetica', 'bold')
    doc.text('Generated by InvoiceAI', pageWidth / 2, pageHeight / 2, {
      align: 'center',
      angle: 45,
    })
  }

  // Save
  doc.save(`Invoice-${invoice.invoiceNumber}.pdf`)
}
