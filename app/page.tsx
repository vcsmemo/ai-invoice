'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import InvoicePreview from '@/components/InvoicePreview';
import Navbar from '@/components/Navbar';
import { InvoiceData } from '@/lib/supabase';

const countryToCurrency: { [key: string]: string } = {
  US: 'USD',
  UK: 'GBP',
  AU: 'AUD',
  CA: 'CAD',
  DE: 'EUR',
};

function HomeContent() {
  const searchParams = useSearchParams();
  const country = searchParams.get('country') || 'US';
  const currency = countryToCurrency[country] || 'USD';

  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleInvoiceGenerated = (data: InvoiceData) => {
    setInvoiceData(data);
  };

  const handleDownload = async () => {
    if (!invoiceData) return;

    setIsDownloading(true);
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoiceData }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          window.location.href = '/api/auth/signin';
          return;
        }
        if (response.status === 403) {
          alert(data.error || 'No credits remaining. Please purchase more credits.');
          window.location.href = '/pricing';
          return;
        }
        throw new Error(data.error || 'Failed to create invoice');
      }

      const result = await response.json();
      const pdfResponse = await fetch(`/api/invoices/${result.invoice.id}/pdf`);
      if (!pdfResponse.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await pdfResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.invoice.invoice_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert(error instanceof Error ? error.message : 'Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const sampleInvoice: InvoiceData = {
    from: {
      name: 'John Doe',
      company: 'Creative Solutions LLC',
      email: 'john@creative-solutions.com',
      address: '123 Studio Way\nSan Francisco, CA 94103',
    },
    customer: {
      name: 'ABC Company',
      company: 'ABC Inc.',
      email: 'billing@abc-inc.com',
      address: '456 Enterprise Blvd\nNew York, NY 10001',
    },
    items: [
      {
        description: 'Web Development Services',
        quantity: 20,
        unitPrice: 100,
        total: 2000,
      },
      {
        description: 'UI/UX Design',
        quantity: 10,
        unitPrice: 85,
        total: 850,
      },
    ],
    subtotal: 2850,
    tax: {
      rate: 8.5,
      amount: 242.25,
    },
    total: 3092.25,
    invoice: {
      invoiceNumber: 'INV-2024-001',
      issueDate: '2024-03-23',
      dueDate: '2024-04-22',
      currency: 'USD',
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center px-6 pt-28 pb-16 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[rgba(200,245,66,0.12)] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs text-muted-foreground mb-10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            V1.0.0 · <span className="text-primary">Ready to use</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5 max-w-4xl mx-auto tracking-tight text-foreground">
            $ ai --generate<br />
            <span className="text-primary">invoice</span> --now
          </h1>

          {/* Subheadline */}
          <p className="text-base text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed font-mono">
            Tell us what you did, who it&apos;s for, and how much. AI handles the rest.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
              className="group px-6 py-3 bg-primary text-primary-foreground rounded-[10px] font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 glow-accent flex items-center gap-2"
            >
              $ start-generater --free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-muted-foreground">Natural language → Professional PDF</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full">
        <div className="mb-12">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(217,145,120)] mb-3 flex items-center gap-2">
            <span className="w-8 h-px bg-[rgb(217,145,120)]/30" />
            How it works
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Three steps.<br />Zero friction.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[rgb(17,17,17)] p-8 border border-[rgba(96,96,104,0.2)] rounded-[10px] hover:border-[rgb(217,145,120)]/30 transition-colors relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-xs text-[rgb(163,161,161)]/20 font-bold group-hover:text-[rgb(217,145,120)]/20 transition-colors">0x01</div>
            <h3 className="text-base font-bold mb-3 flex items-center gap-2 text-[rgb(217,145,120)]">
              <span className="text-[rgb(163,163,163)]">$</span> describe
            </h3>
            <p className="text-sm text-[rgb(163,163,163)] leading-relaxed">
              Tell us what you did in plain English. AI extracts items and amounts.
            </p>
          </div>

          <div className="bg-[rgb(17,17,17)] p-8 border border-[rgba(96,96,104,0.2)] rounded-[10px] hover:border-[rgb(217,145,120)]/30 transition-colors relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-xs text-[rgb(163,163,163)]/20 font-bold group-hover:text-[rgb(217,145,120)]/20 transition-colors">0x02</div>
            <h3 className="text-base font-bold mb-3 flex items-center gap-2 text-[rgb(217,145,120)]">
              <span className="text-[rgb(163,163,163)]">$</span> process --smart
            </h3>
            <p className="text-sm text-[rgb(163,163,163)] leading-relaxed">
              Client details, invoice numbers, taxes — structured automatically.
            </p>
          </div>

          <div className="bg-[rgb(17,17,17)] p-8 border border-[rgba(96,96,104,0.2)] rounded-[10px] hover:border-[rgb(217,145,120)]/30 transition-colors relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-xs text-[rgb(163,163,163)]/20 font-bold group-hover:text-[rgb(217,145,120)]/20 transition-colors">0x03</div>
            <h3 className="text-base font-bold mb-3 flex items-center gap-2 text-[rgb(217,145,120)]">
              <span className="text-[rgb(163,163,163)]">$</span> deploy --pdf
            </h3>
            <p className="text-sm text-[rgb(163,163,163)] leading-relaxed">
              Download as professional PDF or share a payment link. One click.
            </p>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section className="py-16 px-6 relative" id="generator">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Chat Interface */}
            <div className="sticky top-6">
              <ChatInterface 
              onInvoiceGenerated={handleInvoiceGenerated} 
              isLoading={isDownloading} 
              initialCurrency={currency}
              initialCountry={country}
            /></div>{/* Invoice Preview */}
            <div className="lg:pl-6">
              <InvoicePreview invoiceData={invoiceData || sampleInvoice} />

              {invoiceData && (
                <div className="mt-5 text-center">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="btn-primary"
                  >
                    {isDownloading ? 'Downloading...' : 'Download PDF'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center relative border-y border-[rgba(96,96,104,0.1)]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[350px] h-[250px] bg-[rgba(217,145,120,0.08)] rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-foreground">
            Stop wasting time <em className="text-primary not-italic">building</em> invoices.
          </h2>
          <p className="text-muted-foreground mb-7 font-mono text-sm">5 free invoices per month. Upgrade when you&apos;re ready.</p>

          <button
            onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
            className="group px-6 py-3 bg-primary text-primary-foreground rounded-[10px] font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 glow-accent inline-flex items-center gap-2"
          >
            $ start-deploying
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
