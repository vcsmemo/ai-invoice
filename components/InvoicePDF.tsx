import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';
import { InvoiceData } from '@/lib/supabase';
import { formatCurrency } from '@/lib/currencies';

Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    backgroundColor: '#FFFFFF',
    padding: 48,
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoImage: {
    width: 120,
    height: 48,
    objectFit: 'contain',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 48,
    height: 48,
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 9,
    color: '#6B7280',
  },
  poNumber: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
  },
  regularText: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 3,
  },
  suText: {
    fontSize: 8,
    color: '#9CA3AF',
    marginTop: 2,
  },
  taxId: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
  },
  invoiceDetails: {
    textAlign: 'right',
  },
  totalLabel: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  customerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  company: {
    fontSize: 11,
    color: '#6B7280',
  },
  table: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 12,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableCell: {
    flex: 1,
    padding: 12,
    fontSize: 10,
    color: '#111827',
  },
  tableCellRight: {
    flex: 1,
    padding: 12,
    fontSize: 10,
    color: '#111827',
    textAlign: 'right',
  },
  tableCellCenter: {
    flex: 1,
    padding: 12,
    fontSize: 10,
    color: '#111827',
    textAlign: 'center',
  },
  totals: {
    alignSelf: 'flex-end',
    width: 200,
    marginTop: 24,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRowLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  totalRowValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
  },
  finalTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
  },
  finalTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  finalTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  dates: {
    flexDirection: 'row',
    gap: 32,
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
});

interface InvoicePDFProps {
  invoiceData: InvoiceData;
  invoiceNumber?: string;
}

export default function InvoicePDF({ invoiceData, invoiceNumber = 'INV-001' }: InvoicePDFProps) {
  const { from, customer, items, subtotal, tax, total, invoice, payment, discount } = invoiceData;

  const currency = invoice.currency || 'USD';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            {from?.logo ? (
              <Image style={styles.logoImage} src={from.logo} />
            ) : (
              <View style={styles.logoContainer}>
                <View style={styles.logoBox}>
                  <Text style={styles.logoText}>{from?.company?.substring(0, 2).toUpperCase() || 'INV'}</Text>
                </View>
              </View>
            )}
            <View style={{ marginTop: 12 }}>
              <Text style={styles.title}>Invoice</Text>
              <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber || invoiceNumber}</Text>
              {invoice.poNumber && (
                <Text style={styles.poNumber}>PO: {invoice.poNumber}</Text>
              )}
            </View>
          </View>
          <View style={styles.invoiceDetails}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>{formatCurrency(total, currency)}</Text>
          </View>
        </View>

        {/* From Section */}
        {from && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>From</Text>
            {from.company && <Text style={styles.companyName}>{from.company}</Text>}
            {from.name && <Text style={styles.regularText}>{from.name}</Text>}
            {from.address && <Text style={styles.regularText}>{from.address}</Text>}
            {(from.email || from.phone) && (
              <Text style={styles.regularText}>
                {[from.email, from.phone].filter(Boolean).join(' • ')}
              </Text>
            )}
            {from.website && <Text style={styles.regularText}>{from.website}</Text>}
            {from.taxId && <Text style={styles.taxId}>Tax ID: {from.taxId}</Text>}
          </View>
        )}

        {/* Bill To */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <Text style={styles.customerName}>{customer.name}</Text>
          {customer.company && <Text style={styles.company}>{customer.company}</Text>}
          {customer.address && <Text style={styles.regularText}>{customer.address}</Text>}
          {customer.email && <Text style={styles.regularText}>{customer.email}</Text>}
        </View>

        {/* Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Line Items</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <View style={[styles.tableHeaderCell, { flex: 3 }]}>
                <Text>Description</Text>
              </View>
              <View style={[styles.tableHeaderCell, { flex: 1 }]}>
                <Text>Qty</Text>
              </View>
              <View style={[styles.tableHeaderCell, { flex: 1 }]}>
                <Text>Price</Text>
              </View>
              <View style={[styles.tableHeaderCell, { flex: 1 }]}>
                <Text>Total</Text>
              </View>
            </View>
            {items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCell, { flex: 3 }]}>
                  <Text>{item.description}</Text>
                  {item.sku && <Text style={styles.suText}>SKU: {item.sku}</Text>}
                </View>
                <View style={styles.tableCellCenter}>
                  <Text>{item.quantity}</Text>
                </View>
                <View style={styles.tableCellRight}>
                  <Text>{formatCurrency(item.unitPrice, currency)}</Text>
                </View>
                <View style={styles.tableCellRight}>
                  <Text>{formatCurrency(item.total, currency)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalRowLabel}>Subtotal</Text>
            <Text style={styles.totalRowValue}>{formatCurrency(subtotal, currency)}</Text>
          </View>

          {discount && discount.amount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalRowLabel}>
                Discount {discount.percent ? `(${discount.percent}%)` : ''}
              </Text>
              <Text style={[styles.totalRowValue, { color: '#059669' }]}>
                -{formatCurrency(discount.amount, currency)}
              </Text>
            </View>
          )}

          {tax && tax.rate > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalRowLabel}>
                {tax.description || 'Tax'} ({tax.rate}%)
              </Text>
              <Text style={styles.totalRowValue}>{formatCurrency(tax.amount, currency)}</Text>
            </View>
          )}

          <View style={styles.finalTotal}>
            <Text style={styles.finalTotalLabel}>Total</Text>
            <Text style={styles.finalTotalValue}>{formatCurrency(total, currency)}</Text>
          </View>
        </View>

        {/* Dates */}
        <View style={styles.dates}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Issue Date</Text>
            <Text style={styles.dateValue}>{invoice.issueDate}</Text>
          </View>
          {invoice.dueDate && (
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Due Date</Text>
              <Text style={styles.dateValue}>{invoice.dueDate}</Text>
            </View>
          )}
          {invoice.paymentTerms && (
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Payment Terms</Text>
              <Text style={styles.dateValue}>{invoice.paymentTerms}</Text>
            </View>
          )}
        </View>

        {/* Payment Information */}
        {payment && (payment.instructions || payment.bankAccount || payment.paypalEmail) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Information</Text>
            {payment.instructions && (
              <Text style={styles.regularText}>{payment.instructions}</Text>
            )}
            {payment.bankAccount && (
              <Text style={styles.regularText}>Bank Account: {payment.bankAccount}</Text>
            )}
            {payment.paypalEmail && (
              <Text style={styles.regularText}>PayPal: {payment.paypalEmail}</Text>
            )}
          </View>
        )}

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.regularText}>{invoice.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
