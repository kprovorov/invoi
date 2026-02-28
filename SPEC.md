# invoi — iOS App Spec

Build a native iOS invoice generator app called **invoi**. No account, no backend, no network requests. Everything lives on-device. The app lets users fill out an invoice form, see a live PDF-quality preview, and export the invoice as a PDF to share or save.

---

## Core Concept

The app has two panes (or screens on iPhone):
1. **Form** — user fills in invoice fields
2. **Preview** — live-rendered invoice that looks exactly like a printed document

On iPad: side-by-side (form on the left, ~380pt wide; preview fills the rest).
On iPhone: two tabs or a segmented control to switch between Form and Preview.

---

## Data Model

```swift
struct LineItem: Identifiable, Codable {
    var id: String          // unique, e.g. UUID string
    var description: String // item description
    var quantity: Double    // e.g. 2
    var rate: Double        // e.g. 300.00
}

struct Invoice: Codable {
    // From (sender)
    var fromName: String    // "Acme Studio"
    var fromEmail: String   // "hello@acmestudio.com"
    var fromPhone: String   // "+1 234 567 8900"
    var fromAddress: String // "123 Design Ave, San Francisco"

    // Bill To (client)
    var toName: String      // "Meridian Group"
    var toEmail: String     // "client@email.com"
    var toAddress: String   // "456 Client St, New York"

    // Invoice details
    var invoiceNumber: String  // "INV-0001"
    var issueDate: String      // "2026-03-01" (YYYY-MM-DD)
    var dueDate: String        // "2026-03-31" or "" if none
    var currency: String       // "USD"
    var vatRate: Double        // 0 = no VAT, 20 = 20% VAT

    // Line items
    var lineItems: [LineItem]

    // Bank / payment details
    var bankBeneficiary: String // "Acme Studio Ltd."
    var bankName: String        // "First National Bank"
    var bankAccount: String     // "GB29 NWBK 6016 1331 9268 19"
    var bankSwift: String       // "NWBKGB2L"
}
```

**Default invoice on first launch:**
- `invoiceNumber`: `"INV-0001"`
- `issueDate`: today's date in `YYYY-MM-DD`
- `dueDate`: `""` (empty — no due date)
- `currency`: `"USD"`
- `vatRate`: `0`
- `lineItems`: one empty item with `quantity: 1`, `rate: 0`
- All other fields: `""`

---

## Persistence

- Save the current invoice to **UserDefaults** or a local JSON file. No iCloud sync needed.
- Auto-save on every change, debounced ~400ms (save after user stops typing, not on every keystroke).
- Load saved invoice on app launch. If none exists, use the default.
- Silently ignore save/load errors — not critical.

---

## Supported Currencies

Picker should include these currency codes in this order:

```
// Major global
USD, EUR, GBP, CHF, JPY, CNY
// Anglosphere
CAD, AUD, NZD, SGD, HKD
// Europe
SEK, NOK, DKK, PLN, CZK, HUF, RON, BGN, HRK
// Eastern Europe / CIS
UAH, GEL, AMD, AZN, KZT
// Middle East
AED, SAR, ILS, QAR, KWD, BHD, OMR
// South & East Asia
INR, IDR, PHP, THB, MYR, VND, BDT, PKR, KRW, TWD
// Americas
BRL, MXN, ARS, CLP, COP, PEN
// Africa
ZAR, NGN, KES, GHS
// Other
TRY
```

---

## Form Sections

The form is a scrollable list of grouped sections. Each field is a standard text input. Section order:

### 1. From
| Field | Placeholder | Keyboard |
|---|---|---|
| Company name | Acme Studio | Default |
| Email | hello@acmestudio.com | Email |
| Address | 123 Design Ave, San Francisco | Default |
| Phone | +1 234 567 8900 | Phone pad |

### 2. Bill To
| Field | Placeholder | Keyboard |
|---|---|---|
| Client name | Meridian Group | Default |
| Email | client@email.com | Email |
| Address | 456 Client St, New York | Default |

### 3. Bank Details
| Field | Placeholder | Keyboard |
|---|---|---|
| Beneficiary | Acme Studio Ltd. | Default |
| Bank name | First National Bank | Default |
| Account number / IBAN | GB29 NWBK 6016 1331 9268 19 | Default |
| SWIFT / BIC | NWBKGB2L | Default |

### 4. Invoice Details
Two-column row layout (side by side where space allows):
- **Invoice #** — text field, placeholder `INV-0001`
- **Issue Date** — date picker, defaults to today
- **Due Date** — date picker, placeholder "No due date", clearable
- **Currency** — picker/wheel with the currency list above
- **VAT %** — number input, placeholder `0`, defaults to `0` (hidden in preview when 0)

### 5. Line Items
Each item row has three inputs:
- **Description** — text field, flexible width, placeholder "Item description"
- **Qty** — number input, fixed narrow width (~48pt), integer or decimal
- **Rate** — number input, fixed width (~80pt), decimal, right-aligned

Actions per row:
- **Delete button** (trailing swipe or trash icon) — removes the line item
- Minimum 1 line item at all times is not enforced; user can delete all if they want

Below the list:
- **"+ Add item"** button — appends a new empty line item (qty 1, rate 0)

---

## Invoice Preview

The preview renders the invoice as a document that looks exactly like the PDF output. It should faithfully match this layout:

### Visual design
- White background, no chrome
- Font: **SF Mono** or a monospace system font (the web version uses Lilex, a monospace font — match the feel with SF Mono)
- Primary text: `#111111`
- Secondary/muted text: `#888888`
- Borders: `#E5E5E5`
- Canvas background around the paper: `#EBEBEB`

### Layout (top to bottom)

**Header row** — two columns, space-between:
- Left: company name (bold, ~26pt), then email, phone, address beneath it (12pt, muted)
- Right: word "INVOICE" (bold, ~34pt, tight tracking), invoice number below it (12pt, muted)

**Bill To + Dates row** — two columns, space-between:
- Left:
  - Label "BILL TO" (10pt, semibold, muted, uppercase, tracked)
  - Client name (bold, 15pt)
  - Client email (12pt, muted)
  - Client address (12pt, muted)
- Right: date columns side by side, right-aligned
  - "ISSUE DATE" label + formatted date
  - "DUE DATE" label + formatted date (hidden if empty)

**Line items table:**
- Header row with columns: Description / Qty / Rate / Amount — separated by a 1.5pt dark bottom border (`#111111`)
- Each item row: separated by a 1pt `#E5E5E5` border
  - Description (flexible, 13pt)
  - Qty (center, 13pt, muted)
  - Rate (right-aligned, 13pt, muted)
  - Amount = qty × rate (right-aligned, 13pt, medium weight)
- Column widths: Description fills remaining space; Qty ~56pt; Rate ~128pt; Amount ~128pt

**Totals block** — right-aligned:
- Subtotal label + value (12pt)
- "VAT X%" label + value (12pt) — hidden when `vatRate` is 0
- Thin `#E5E5E5` separator line (~192pt wide)
- "Total" (bold, 15pt) + total amount (bold, 20pt) — total = subtotal + VAT

**Payment Details** (only shown if at least one bank field is filled):
- Top border `#E5E5E5`, section label "PAYMENT DETAILS" (uppercase, 10pt, muted)
- Rows: Bank / Account / SWIFT-BIC — label in muted 96pt-wide column, value in dark text

### Date formatting
Dates stored as `YYYY-MM-DD` strings. Display as: `Mar 12, 2026` (US locale, short month).

### Currency formatting
Use `Intl`-equivalent formatting: `$1,234.56`, `€1.234,56` etc. matching the locale convention for that currency. Use `NumberFormatter` with `.currencyCode` style.

---

## PDF Export

- Tap **"Download PDF"** (or "Export PDF" / "Share") button
- Render the invoice preview into a PDF — one A4 page (210mm × 297mm)
- Present the system share sheet (`UIActivityViewController`) with the PDF
- PDF filename: `{invoiceNumber} - {fromName}.pdf` — use whatever parts are non-empty; fall back to `invoice.pdf`
- No extra margins beyond what's in the design (the invoice already has internal padding)

---

## App Structure

### iPhone navigation
- **Tab bar** with two tabs: "Form" and "Preview"
- Or a segmented control at the top
- "Export PDF" button always accessible (e.g., in the navigation bar on Preview tab, or at the bottom of Form tab)

### iPad layout
- `NavigationSplitView` or `HStack`:
  - Left column: form, ~380pt wide, scrollable
  - Right column: preview fills remaining space, centered, with `#EBEBEB` background
- "Export PDF" button in the toolbar or bottom of the left column

---

## App Details

- **App name:** invoi
- **Bundle ID:** xyz.invoi (or similar)
- **Minimum iOS:** 17
- **Orientation:** Portrait + Landscape on iPad; Portrait on iPhone
- **Accent color:** `#111111` (near-black)
- No onboarding, no splash screen content beyond the default launch screen
- No analytics, no crash reporting, no network calls of any kind

---

## What This App Is NOT

- No authentication
- No cloud sync
- No multi-invoice management (one invoice at a time, always the same one)
- No tax calculation
- No logo/image upload
- No custom templates
- No dark mode requirement (light only is fine for v1)
