export interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
}

export interface Invoice {
  fromName: string
  fromEmail: string
  fromAddress: string
  toName: string
  toEmail: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  lineItems: LineItem[]
}

export function newLineItem(): LineItem {
  return { id: crypto.randomUUID(), description: '', quantity: 1, rate: 0 }
}

export const defaultInvoice: Invoice = {
  fromName: '',
  fromEmail: '',
  fromAddress: '',
  toName: '',
  toEmail: '',
  invoiceNumber: 'INV-0001',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  lineItems: [newLineItem()],
}
