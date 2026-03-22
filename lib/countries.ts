import { CountryConfig } from './types'

export const countries: Record<string, CountryConfig> = {
  US: {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    taxLabel: 'Tax',
    taxRate: 0,
    dateFormat: 'MM/DD/YYYY',
    notes: 'Payment due within 30 days. Thank you for your business!',
  },
  UK: {
    code: 'UK',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    taxLabel: 'VAT',
    taxRate: 20,
    dateFormat: 'DD/MM/YYYY',
    notes: 'Payment due within 30 days. VAT No: GB123456789',
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    taxLabel: 'GST',
    taxRate: 10,
    dateFormat: 'DD/MM/YYYY',
    notes: 'Payment due within 30 days. ABN: 12 345 678 901',
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    taxLabel: 'GST/HST',
    taxRate: 5,
    dateFormat: 'YYYY-MM-DD',
    notes: 'Payment due within 30 days. GST No: 123456789RT0001',
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    taxLabel: 'MwSt',
    taxRate: 19,
    dateFormat: 'DD.MM.YYYY',
    notes: 'Payment due within 14 days. USt-IdNr: DE123456789',
  },
}

export const generateInvoiceNumber = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 9999)
  return `INV-${year}${month}-${random}`
}

export const calculateInvoiceTotal = (items: any[], taxRate: number) => {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax
  return { subtotal, tax, total }
}
