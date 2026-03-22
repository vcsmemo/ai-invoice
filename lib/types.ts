export interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  from: {
    name: string
    email: string
    address: string
    phone?: string
  }
  to: {
    name: string
    email: string
    address: string
  }
  items: {
    id: string
    description: string
    quantity: number
    rate: number
    amount: number
  }[]
  notes: string
  taxRate: number
  currency: string
  country: string
}

export interface CountryConfig {
  code: string
  name: string
  flag: string
  currency: string
  taxLabel: string
  taxRate: number
  dateFormat: string
  notes: string
}
