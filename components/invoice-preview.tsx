'use client'

import { useRef, useState, useEffect } from 'react'
import { Twitter, Github } from 'lucide-react'
import { type Invoice } from '@/lib/types'
import { PAPER_W, PAPER_H } from '@/lib/constants'
import { formatDate, formatCurrency } from '@/lib/utils'

export function InvoicePreview({ invoice }: { invoice: Invoice }) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const recalcScale = () => {
      const available = el.clientWidth - 32 // 16px breathing room each side
      setScale(Math.min(available / PAPER_W, 1))
    }
    recalcScale()
    const ro = new ResizeObserver(recalcScale)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0)

  return (
    <main
      ref={canvasRef}
      className="md:flex-1 bg-[#EBEBEB] overflow-auto flex flex-col items-center py-8 print:block print:bg-white print:overflow-visible print:py-0"
    >
      {/* Scale wrapper — occupies the visual space of the scaled paper */}
      <div style={{ width: PAPER_W * scale, height: PAPER_H * scale }} className="print:!w-full print:!h-auto">
        {/* Invoice paper — fixed natural size, scaled via transform */}
        <div
          style={{ width: PAPER_W, height: PAPER_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}
          className="bg-white rounded-sm shadow-[0_4px_32px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)] px-14 py-14 print:!transform-none print:shadow-none print:rounded-none print:!w-full print:!h-auto print:m-0"
        >
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
              <span className="w-32 text-[10px] font-semibold text-[#111111] tracking-[0.07em] uppercase text-right">
                Rate
              </span>
              <span className="w-32 text-[10px] font-semibold text-[#111111] tracking-[0.07em] uppercase text-right">
                Amount
              </span>
            </div>
            {invoice.lineItems.map((item) => (
              <div key={item.id} className="flex py-3.5 border-b border-[#E5E5E5] items-center">
                <span className="flex-1 text-[13px] text-[#111111]">
                  {item.description || '—'}
                </span>
                <span className="w-14 text-[13px] text-[#888888] text-center">
                  {item.quantity}
                </span>
                <span className="w-32 text-[13px] text-[#888888] text-right">
                  {formatCurrency(item.rate, invoice.currency)}
                </span>
                <span className="w-32 text-[13px] font-medium text-[#111111] text-right">
                  {formatCurrency(item.quantity * item.rate, invoice.currency)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex flex-col items-end gap-2 mb-12">
            <div className="flex gap-8 items-center">
              <span className="text-[12px] text-[#888888]">Subtotal</span>
              <span className="text-[12px] font-medium text-[#111111] w-32 text-right">
                {formatCurrency(subtotal, invoice.currency)}
              </span>
            </div>
            <div className="w-48 h-px bg-[#E5E5E5]" />
            <div className="flex gap-8 items-center">
              <span className="text-[15px] font-bold text-[#111111] tracking-tight">Total</span>
              <span className="text-[20px] font-bold text-[#111111] tracking-tight w-32 text-right">
                {formatCurrency(subtotal, invoice.currency)}
              </span>
            </div>
          </div>

          {/* Bank details */}
          {(invoice.bankBeneficiary || invoice.bankName || invoice.bankAccount || invoice.bankSwift) && (
            <div className="border-t border-[#E5E5E5] pt-6 flex flex-col gap-1.5">
              <p className="text-[10px] font-semibold text-[#888888] tracking-[0.1em] uppercase mb-1">
                Payment Details
              </p>
              {invoice.bankBeneficiary && (
                <div className="flex gap-2">
                  <span className="text-[12px] text-[#888888] w-24 shrink-0">Beneficiary</span>
                  <span className="text-[12px] text-[#111111]">{invoice.bankBeneficiary}</span>
                </div>
              )}
              {invoice.bankName && (
                <div className="flex gap-2">
                  <span className="text-[12px] text-[#888888] w-24 shrink-0">Bank</span>
                  <span className="text-[12px] text-[#111111]">{invoice.bankName}</span>
                </div>
              )}
              {invoice.bankAccount && (
                <div className="flex gap-2">
                  <span className="text-[12px] text-[#888888] w-24 shrink-0">IBAN</span>
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

      {/* Footer */}
      <div style={{ width: PAPER_W * scale }} className="flex items-center justify-between px-1 mt-4 print:hidden">
          <span className="text-[11px] text-[#AAAAAA]">
            © {new Date().getFullYear()} invoi.xyz by Kirill Provorov
          </span>
          <div className="flex items-center gap-3">
            <a
              href="https://x.com/kprovorov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#BBBBBB] hover:text-[#888888] transition-colors"
              aria-label="Twitter / X"
            >
              <Twitter size={13} />
            </a>
            <a
              href="https://github.com/kprovorov/invoi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#BBBBBB] hover:text-[#888888] transition-colors"
              aria-label="GitHub"
            >
              <Github size={13} />
            </a>
          </div>
        </div>
    </main>
  )
}
