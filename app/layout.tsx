import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'invoi.xyz — Free Invoice Generator',
  description:
    'Create, preview and download professional PDF invoices in seconds. Free, no account needed, works in your browser.',
  keywords: [
    'invoice generator',
    'free invoice maker',
    'online invoice',
    'PDF invoice',
    'invoice template',
    'create invoice',
    'freelance invoice',
    'invoice download',
  ],
  metadataBase: new URL('https://invoi.xyz'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'invoi.xyz — Free Invoice Generator',
    description:
      'Create, preview and download professional PDF invoices in seconds. Free, no account needed.',
    url: 'https://invoi.xyz',
    siteName: 'invoi.xyz',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'invoi.xyz — Free Invoice Generator',
    description:
      'Create, preview and download professional PDF invoices in seconds. Free, no account needed.',
    creator: '@kprovorov',
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
