'use client'

import { useState, useEffect, useCallback } from 'react'
import { type Invoice, type LineItem, newLineItem, defaultInvoice } from './types'
import { loadInvoice, saveInvoice } from './store'

export function useInvoice() {
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
    const params = new URLSearchParams(window.location.search)
    if (!params.size) return
    const overrides: Partial<Invoice> = {}
    for (const [key, value] of params.entries()) {
      if (key in defaultInvoice) {
        const field = key as keyof Invoice
        if (field === 'vatRate') {
          overrides.vatRate = parseFloat(value) || 0
        } else if (field !== 'lineItems') {
          (overrides as Record<string, string>)[field] = value
        }
      }
    }
    if (Object.keys(overrides).length > 0) {
      setInvoice((prev) => ({ ...prev, ...overrides }))
    }
  }, [loaded])

  useEffect(() => {
    if (!loaded) return
    const timer = setTimeout(() => saveInvoice(invoice), 400)
    return () => clearTimeout(timer)
  }, [invoice, loaded])

  useEffect(() => {
    if (!loaded) return
    // Start from current params so non-invoice params (e.g. print=true) are preserved
    const params = new URLSearchParams(window.location.search)
    for (const key of Object.keys(defaultInvoice) as (keyof Invoice)[]) {
      if (key === 'lineItems') continue
      const value = invoice[key]
      const def = defaultInvoice[key]
      if (value !== def && value !== '' && value !== 0) {
        params.set(key, String(value))
      } else {
        params.delete(key)
      }
    }
    const qs = params.size ? `?${params.toString()}` : window.location.pathname
    history.replaceState(null, '', qs)
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

  return { invoice, loaded, update, updateItem, addItem, removeItem }
}
