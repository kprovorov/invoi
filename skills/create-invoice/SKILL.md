---
name: create-invoice
description: Generate an invoi.xyz pre-filled URL from invoice details provided by the user. Use when asked to "create an invoice", "generate an invoice URL", or "make an invoice link".
metadata:
  author: invoi
  version: "1.0.0"
  argument-hint: <invoice details>
---

# Create Invoice URL

Generate a pre-filled invoi.xyz URL from the invoice details the user provides.

## How It Works

1. Ask the user for invoice details (or extract them from the current conversation)
2. Map the details to the available query params listed below
3. Build a valid URL: `https://invoi.xyz?param1=value1&param2=value2`
4. URL-encode any values that contain spaces or special characters
5. Return the final URL clearly, ready to copy

## Available Params

| Param | Description |
|---|---|
| `fromName` | Company / sender name |
| `fromEmail` | Sender email |
| `fromPhone` | Sender phone |
| `fromAddress` | Sender address |
| `toName` | Client name |
| `toEmail` | Client email |
| `toAddress` | Client address |
| `invoiceNumber` | Invoice number (e.g. INV-0042) |
| `issueDate` | Issue date in YYYY-MM-DD format |
| `dueDate` | Due date in YYYY-MM-DD format |
| `currency` | ISO 4217 currency code (e.g. USD, EUR, UAH) |
| `vatRate` | VAT percentage as a number (e.g. 20) |
| `bankBeneficiary` | Account holder / beneficiary name |
| `bankName` | Bank name |
| `bankSortCode` | Sort code (UK) or routing number (US) |
| `bankAccount` | Account number or IBAN |
| `bankSwift` | SWIFT / BIC code |
| `print` | Set to `true` to auto-open print dialogue on load |

## Rules

- Only include params for values the user actually provided — omit empty fields
- Dates must be formatted as `YYYY-MM-DD`
- Currency must be a valid ISO 4217 code — infer it from context if not explicitly given (e.g. "$" → USD, "€" → EUR, "£" → GBP)
- `vatRate` must be a plain number (20, not "20%")
- If the user says "ready to print" or "send to print", append `&print=true`
- Line items cannot be encoded in the URL — mention this if the user provides them

## Output Format

Present the result as:

```
https://invoi.xyz?fromName=Acme+Studio&toName=Meridian+Group&currency=EUR&invoiceNumber=INV-0042
```

Then offer a short summary of what was included and what was left out (e.g. line items).
