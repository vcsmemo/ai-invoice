import { InvoiceData } from './supabase';

export const sampleInvoice: InvoiceData = {
  from: {
    name: 'John Doe',
    company: 'Creative Solutions LLC',
    email: 'john@creative-solutions.com',
    address: '123 Studio Way\nSan Francisco, CA 94103',
  },
  customer: {
    name: 'ABC Company',
    company: 'ABC Inc.',
    email: 'billing@abc-inc.com',
    address: '456 Enterprise Blvd\nNew York, NY 10001',
  },
  items: [
    {
      description: 'Web Development Services',
      quantity: 20,
      unitPrice: 100,
      total: 2000,
    },
    {
      description: 'UI/UX Design',
      quantity: 10,
      unitPrice: 85,
      total: 850,
    },
  ],
  subtotal: 2850,
  tax: {
    rate: 8.5,
    amount: 242.25,
  },
  total: 3092.25,
  invoice: {
    invoiceNumber: 'INV-2024-001',
    issueDate: '2024-03-23',
    dueDate: '2024-04-22',
    currency: 'USD',
  },
};
