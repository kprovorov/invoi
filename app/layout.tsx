import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'invoi.xyz — Free invoice generator',
  description: 'Create, preview and download professional PDF invoices. No account needed.',
  openGraph: {
    title: 'invoi.xyz — Free invoice generator',
    description: 'Create, preview and download professional PDF invoices. No account needed.',
    url: 'https://invoi.xyz',
    siteName: 'invoi.xyz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'invoi.xyz — Free invoice generator',
    description: 'Create, preview and download professional PDF invoices. No account needed.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
