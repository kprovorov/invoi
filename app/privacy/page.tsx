import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — invoi.xyz',
  description: 'Privacy policy for invoi.xyz — free invoice generator.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-[13px] text-[#888888] hover:text-[#111111] transition-colors mb-12 inline-block"
        >
          ← invoi.xyz
        </Link>

        <h1 className="font-bold text-[32px] text-[#111111] tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-[13px] text-[#888888] mb-12">Last updated: February 27, 2026</p>

        <div className="space-y-10 text-[14px] leading-relaxed text-[#333333]">

          <section className="space-y-3">
            <h2 className="font-semibold text-[16px] text-[#111111] tracking-tight">The short version</h2>
            <p>
              invoi.xyz does not collect, store, or transmit any personal data to our servers.
              Your invoice data never leaves your device.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-[16px] text-[#111111] tracking-tight">Your invoice data</h2>
            <p>
              All data you enter — company name, client details, line items, bank details — is stored
              exclusively on your device. It is never sent to any server, never shared with any
              third party, and never used for any purpose other than rendering your invoice.
            </p>
            <p>
              Deleting the app or its data will erase your saved invoice.
              We have no way to recover it.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-[16px] text-[#111111] tracking-tight">PDF export</h2>
            <p>
              PDFs are generated entirely on your device. No data is uploaded to any server
              during this process.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-[16px] text-[#111111] tracking-tight">Third parties</h2>
            <p>
              We do not sell, share, or transfer any data to third parties. We have no user accounts,
              no email lists, and no advertising.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-[16px] text-[#111111] tracking-tight">Contact</h2>
            <p>
              Questions? Reach out on{' '}
              <a
                href="https://x.com/kprovorov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#111111] underline underline-offset-2"
              >
                X / Twitter
              </a>
              .
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
