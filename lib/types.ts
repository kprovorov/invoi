export interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
}

export interface Invoice {
  fromName: string
  fromEmail: string
  fromPhone: string
  fromAddress: string
  toName: string
  toEmail: string
  toAddress: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  currency: string
  lineItems: LineItem[]
  bankName: string
  bankAccount: string
  bankSwift: string
}

export function newLineItem(): LineItem {
  return { id: crypto.randomUUID(), description: '', quantity: 1, rate: 0 }
}

export const defaultInvoice: Invoice = {
  fromName: '',
  fromEmail: '',
  fromPhone: '',
  fromAddress: '',
  toName: '',
  toEmail: '',
  toAddress: '',
  invoiceNumber: 'INV-0001',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  currency: 'USD',
  lineItems: [newLineItem()],
  bankName: '',
  bankAccount: '',
  bankSwift: '',
}
