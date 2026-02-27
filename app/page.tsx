'use client'

import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import { Plus, Trash2, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Invoice, type LineItem, newLineItem, defaultInvoice } from '@/lib/types'
import { loadInvoice, saveInvoice } from '@/lib/store'

const INPUT_CLASS =
  'h-9 w-full border border-[#E5E5E5] rounded-lg bg-[#FAFAFA] px-3 text-[13px] text-[#111111] font-[family-name:var(--font-mono)] focus:outline-none focus:border-[#111111] placeholder:text-[#BBBBBB] transition-colors'

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label className="text-[12px] font-medium text-[#555555]">{label}</label>
      {children}
    </div>
  )
}

const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'CHF', 'CAD', 'AUD', 'NZD',
  'JPY', 'CNY', 'HKD', 'SGD', 'KRW',
  'INR', 'AED', 'SAR', 'ILS',
  'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'UAH',
  'BRL', 'MXN', 'ZAR', 'TRY',
]

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount)
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function Home() {
  const [invoice, setInvoice] = useState<Invoice>(defaultInvoice)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loadInvoice().then((saved) => {
      if (saved) setInvoice(saved)
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (!loaded) return
    const timer = setTimeout(() => saveInvoice(invoice), 400)
    return () => clearTimeout(timer)
  }, [invoice, loaded])

  const update = useCallback(<K extends keyof Invoice>(field: K, value: Invoice[K]) => {
    setInvoice((prev) => ({ ...prev, [field]: value }))
  }, [])

  const updateItem = useCallback(
    (id: string, field: keyof LineItem, value: string | number) => {
      setInvoice((prev) => ({
        ...prev,
        lineItems: prev.lineItems.map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      }))
    },
    [],
  )

  const addItem = useCallback(() => {
    setInvoice((prev) => ({ ...prev, lineItems: [...prev.lineItems, newLineItem()] }))
  }, [])

  const removeItem = useCallback((id: string) => {
    setInvoice((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
    }))
  }, [])

  const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0)

  // A4 in CSS pixels at 96dpi: 210mm × 96/25.4 = 794px, 297mm × 96/25.4 = 1123px
  // This ensures preview and print are pixel-identical
  const PAPER_W = 794
  const PAPER_H = 1123

  const canvasRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const update = () => {
      const available = el.clientWidth - 32 // 16px breathing room each side
      setScale(Math.min(available / PAPER_W, 1))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [PAPER_W])

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen md:overflow-hidden bg-[#F5F5F5] print:bg-white">
      {/* ── SIDEBAR ── */}
      <aside className="w-full md:w-[380px] md:h-screen bg-white border-b md:border-b-0 md:border-r border-[#E5E5E5] flex flex-col shrink-0 print:hidden">
        {/* Logo */}
        <div className="flex items-center px-6 py-[22px] border-b border-[#E5E5E5] shrink-0">
          <span className="font-bold text-[17px] text-[#111111] tracking-tight">invoi.xyz</span>
        </div>

        {/* Scrollable form */}
        <div className="md:flex-1 md:overflow-y-auto px-6 py-6 space-y-7 md:min-h-0">
          {/* FROM */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold text-[#888888] tracking-widest uppercase">
              From
            </h3>
            <div className="space-y-2">
              <Field label="Company name">
                <input
                  className={INPUT_CLASS}
                  value={invoice.fromName}
                  onChange={(e) => update('fromName', e.target.value)}
                  placeholder="Acme Studio"
                />
              </Field>
              <Field label="Email">
                <input
                  className={INPUT_CLASS}
                  type="email"
                  value={invoice.fromEmail}
                  onChange={(e) => update('fromEmail', e.target.value)}
                  placeholder="hello@acmestudio.com"
                />
              </Field>
              <Field label="Address">
                <input
                  className={INPUT_CLASS}
                  value={invoice.fromAddress}
                  onChange={(e) => update('fromAddress', e.target.value)}
                  placeholder="123 Design Ave, San Francisco"
                />
              </Field>
              <Field label="Phone">
                <input
                  className={INPUT_CLASS}
                  type="tel"
                  value={invoice.fromPhone}
                  onChange={(e) => update('fromPhone', e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </Field>
            </div>
          </section>

          {/* BILL TO */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold text-[#888888] tracking-widest uppercase">
              Bill To
            </h3>
            <div className="space-y-2">
              <Field label="Client name">
                <input
                  className={INPUT_CLASS}
                  value={invoice.toName}
                  onChange={(e) => update('toName', e.target.value)}
                  placeholder="Meridian Group"
                />
              </Field>
              <Field label="Email">
                <input
                  className={INPUT_CLASS}
                  type="email"
                  value={invoice.toEmail}
                  onChange={(e) => update('toEmail', e.target.value)}
                  placeholder="client@email.com"
                />
              </Field>
              <Field label="Address">
                <input
                  className={INPUT_CLASS}
                  value={invoice.toAddress}
                  onChange={(e) => update('toAddress', e.target.value)}
                  placeholder="456 Client St, New York"
                />
              </Field>
            </div>
          </section>

          {/* BANK DETAILS */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold text-[#888888] tracking-widest uppercase">
              Bank Details
            </h3>
            <div className="space-y-2">
              <Field label="Bank name">
                <input
                  className={INPUT_CLASS}
                  value={invoice.bankName}
                  onChange={(e) => update('bankName', e.target.value)}
                  placeholder="First National Bank"
                />
              </Field>
              <Field label="Account number / IBAN">
                <input
                  className={INPUT_CLASS}
                  value={invoice.bankAccount}
                  onChange={(e) => update('bankAccount', e.target.value)}
                  placeholder="GB29 NWBK 6016 1331 9268 19"
                />
              </Field>
              <Field label="SWIFT / BIC">
                <input
                  className={INPUT_CLASS}
                  value={invoice.bankSwift}
                  onChange={(e) => update('bankSwift', e.target.value)}
                  placeholder="NWBKGB2L"
                />
              </Field>
            </div>
          </section>

          {/* INVOICE DETAILS */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold text-[#888888] tracking-widest uppercase">
              Invoice Details
            </h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Field label="Invoice #" className="flex-1">
                  <input
                    className={INPUT_CLASS}
                    value={invoice.invoiceNumber}
                    onChange={(e) => update('invoiceNumber', e.target.value)}
                    placeholder="INV-0001"
                  />
                </Field>
                <Field label="Issue Date" className="flex-1">
                  <input
                    className={INPUT_CLASS}
                    type="date"
                    value={invoice.issueDate}
                    onChange={(e) => update('issueDate', e.target.value)}
                  />
                </Field>
              </div>
              <div className="flex gap-2">
                <Field label="Due Date" className="flex-1">
                  <input
                    className={INPUT_CLASS}
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) => update('dueDate', e.target.value)}
                  />
                </Field>
                <Field label="Currency" className="flex-1">
                  <select
                    className={INPUT_CLASS}
                    value={invoice.currency}
                    onChange={(e) => update('currency', e.target.value)}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          </section>

          {/* LINE ITEMS */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold text-[#888888] tracking-widest uppercase">
              Line Items
            </h3>
            <div className="space-y-1.5">
              {/* Column headers */}
              <div className="flex gap-2 px-1">
                <span className="flex-1 text-[11px] font-medium text-[#888888]">Description</span>
                <span className="w-10 text-[11px] font-medium text-[#888888] text-center">Qty</span>
                <span className="w-[72px] text-[11px] font-medium text-[#888888] text-right">
                  Rate
                </span>
                <span className="w-5" />
              </div>

              {/* Item rows */}
              {invoice.lineItems.map((item) => (
                <div key={item.id} className="flex gap-2 items-center">
                  <input
                    className={cn(INPUT_CLASS, 'flex-1')}
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                  />
                  <input
                    className={cn(INPUT_CLASS, 'w-10 px-0 text-center')}
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)
                    }
                  />
                  <input
                    className={cn(INPUT_CLASS, 'w-[72px] px-2 text-right')}
                    type="number"
                    min="0"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)
                    }
                    placeholder="0"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-5 flex items-center justify-center text-[#CCCCCC] hover:text-[#888888] transition-colors shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}

              {/* Add item */}
              <button
                onClick={addItem}
                className="w-full h-[34px] border border-dashed border-[#CCCCCC] rounded-lg flex items-center justify-center gap-1.5 text-[12px] font-medium text-[#888888] hover:border-[#888888] hover:text-[#555555] transition-colors mt-1"
              >
                <Plus size={13} />
                Add item
              </button>
            </div>
          </section>
        </div>

        {/* Download button */}
        <div className="px-6 pb-6 pt-4 border-t border-[#E5E5E5] shrink-0">
          <button
            onClick={() => window.print()}
            className="w-full h-11 bg-[#111111] rounded-[10px] flex items-center justify-center gap-2 text-[14px] font-semibold text-white hover:bg-[#333333] transition-colors"
          >
            <Download size={15} strokeWidth={2} />
            Download PDF
          </button>
        </div>
      </aside>

      {/* ── PREVIEW CANVAS ── */}
      <main ref={canvasRef} className="md:flex-1 bg-[#EBEBEB] overflow-auto flex flex-col items-center py-8 print:block print:bg-white print:overflow-visible print:py-0">
        {/* Scale wrapper — occupies the visual space of the scaled paper */}
        <div style={{ width: PAPER_W * scale, height: PAPER_H * scale }} className="print:!w-full print:!h-auto">
        {/* Invoice paper — fixed natural size, scaled via transform */}
        <div
          style={{ width: PAPER_W, height: PAPER_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}
          className="bg-white rounded-sm shadow-[0_4px_32px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)] px-14 py-14 print:!transform-none print:shadow-none print:rounded-none print:!w-full print:!h-auto print:m-0">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="font-bold text-[26px] text-[#111111] tracking-tight leading-none">
                {invoice.fromName || 'Your Company'}
              </p>
              {invoice.fromEmail && (
                <p className="text-[12px] text-[#888888] mt-2">{invoice.fromEmail}</p>
              )}
              {invoice.fromPhone && (
                <p className="text-[12px] text-[#888888]">{invoice.fromPhone}</p>
              )}
              {invoice.fromAddress && (
                <p className="text-[12px] text-[#888888]">{invoice.fromAddress}</p>
              )}
            </div>
            <div className="text-right">
              <p className="font-bold text-[34px] text-[#111111] tracking-[-0.05em] leading-none">
                INVOICE
              </p>
              {invoice.invoiceNumber && (
                <p className="text-[12px] text-[#888888] mt-1">{invoice.invoiceNumber}</p>
              )}
            </div>
          </div>

          {/* Bill To + Dates */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-[10px] font-semibold text-[#888888] tracking-[0.1em] uppercase mb-1.5">
                Bill To
              </p>
              <p className="font-bold text-[15px] text-[#111111] tracking-tight">
                {invoice.toName || '—'}
              </p>
              {invoice.toEmail && (
                <p className="text-[12px] text-[#888888] mt-0.5">{invoice.toEmail}</p>
              )}
              {invoice.toAddress && (
                <p className="text-[12px] text-[#888888]">{invoice.toAddress}</p>
              )}
            </div>
            <div className="flex gap-8">
              {invoice.issueDate && (
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-[#888888] tracking-[0.1em] uppercase mb-1">
                    Issue Date
                  </p>
                  <p className="text-[12px] font-medium text-[#111111]">
                    {formatDate(invoice.issueDate)}
                  </p>
                </div>
              )}
              {invoice.dueDate && (
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-[#888888] tracking-[0.1em] uppercase mb-1">
                    Due Date
                  </p>
                  <p className="text-[12px] font-medium text-[#111111]">
                    {formatDate(invoice.dueDate)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Line items table */}
          <div className="mb-8">
            <div className="flex py-2.5 border-b-[1.5px] border-[#111111]">
              <span className="flex-1 text-[10px] font-semibold text-[#111111] tracking-[0.07em] uppercase">
                Description
              </span>
              <span className="w-14 text-[10px] font-semibold text-[#111111] tracking-[0.07em] uppercase text-center">
                Qty
              </span>
              <span className="w-24 text-[10px] font-semibold text-[#111111] tracking-[0.07em] uppercase text-right">
                Rate
              </span>
              <span className="w-24 text-[10px] font-semibold text-[#111111] tracking-[0.07em] uppercase text-right">
                Amount
              </span>
            </div>
            {invoice.lineItems.map((item) => (
              <div
                key={item.id}
                className="flex py-3.5 border-b border-[#E5E5E5] items-center"
              >
                <span className="flex-1 text-[13px] text-[#111111]">
                  {item.description || '—'}
                </span>
                <span className="w-14 text-[13px] text-[#888888] text-center">
                  {item.quantity}
                </span>
                <span className="w-24 text-[13px] text-[#888888] text-right">
                  {formatCurrency(item.rate, invoice.currency)}
                </span>
                <span className="w-24 text-[13px] font-medium text-[#111111] text-right">
                  {formatCurrency(item.quantity * item.rate, invoice.currency)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex flex-col items-end gap-2 mb-12">
            <div className="flex gap-8 items-center">
              <span className="text-[12px] text-[#888888]">Subtotal</span>
              <span className="text-[12px] font-medium text-[#111111] w-24 text-right">
                {formatCurrency(subtotal, invoice.currency)}
              </span>
            </div>
            <div className="w-48 h-px bg-[#E5E5E5]" />
            <div className="flex gap-8 items-center">
              <span className="text-[15px] font-bold text-[#111111] tracking-tight">Total</span>
              <span className="text-[20px] font-bold text-[#111111] tracking-tight w-24 text-right">
                {formatCurrency(subtotal, invoice.currency)}
              </span>
            </div>
          </div>

          {/* Bank details */}
          {(invoice.bankName || invoice.bankAccount || invoice.bankSwift) && (
            <div className="border-t border-[#E5E5E5] pt-6 flex flex-col gap-1.5">
              <p className="text-[10px] font-semibold text-[#888888] tracking-[0.1em] uppercase mb-1">
                Payment Details
              </p>
              {invoice.bankName && (
                <div className="flex gap-2">
                  <span className="text-[12px] text-[#888888] w-24 shrink-0">Bank</span>
                  <span className="text-[12px] text-[#111111]">{invoice.bankName}</span>
                </div>
              )}
              {invoice.bankAccount && (
                <div className="flex gap-2">
                  <span className="text-[12px] text-[#888888] w-24 shrink-0">Account</span>
                  <span className="text-[12px] text-[#111111]">{invoice.bankAccount}</span>
                </div>
              )}
              {invoice.bankSwift && (
                <div className="flex gap-2">
                  <span className="text-[12px] text-[#888888] w-24 shrink-0">SWIFT / BIC</span>
                  <span className="text-[12px] text-[#111111]">{invoice.bankSwift}</span>
                </div>
              )}
            </div>
          )}

        </div>
        </div>

      </main>
    </div>
  )
}
