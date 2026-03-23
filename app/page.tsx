'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import InvoicePreview from '@/components/InvoicePreview';
import LoginPrompt from '@/components/LoginPrompt';
import StatsCard from '@/components/StatsCard';
import StatsChart from '@/components/StatsChart';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';
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
  const { data: session } = useSession();

  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleInvoiceGenerated = (data: InvoiceData) => {
    setInvoiceData(data);
  };

  const handleDownload = async () => {
    console.log('[handleDownload] FUNCTION CALLED!');
    console.log('[handleDownload] session:', session);
    console.log('[handleDownload] session.user:', session?.user);

    // Use either generated invoice or sample invoice
    const dataToDownload = invoiceData || sampleInvoice;

    if (!dataToDownload) {
      console.error('[PDF Download] No invoice data available');
      alert('No invoice data to download');
      return;
    }

    // Check if user is logged in
    if (!session?.user) {
      console.log('[PDF Download] User not logged in');
      alert('Please sign in to download invoices. You\'ll get 5 free credits to start!');
      setShowLoginPrompt(true);
      return;
    }

    console.log('[PDF Download] Starting download process...');
    console.log('[PDF Download] Using data:', invoiceData ? 'generated invoice' : 'sample invoice');
    setIsDownloading(true);

    try {
      // Step 1: Create invoice
      console.log('[PDF Download] Step 1: Creating invoice in database...');
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoiceData: dataToDownload }),
      });

      console.log('[PDF Download] Create invoice response status:', response.status);

      if (!response.ok) {
        const data = await response.json();
        console.error('[PDF Download] Create invoice failed:', data);
        if (response.status === 401) {
          setShowLoginPrompt(true);
          return;
        }
        if (response.status === 403) {
          window.location.href = '/pricing';
          return;
        }
        throw new Error(data.error || 'Failed to create invoice');
      }

      const result = await response.json();
      console.log('[PDF Download] Invoice created successfully:', result);

      if (!result.invoice?.id) {
        throw new Error('Invalid response: missing invoice ID');
      }

      // Step 2: Generate PDF
      console.log('[PDF Download] Step 2: Generating PDF for invoice:', result.invoice.id);
      const pdfResponse = await fetch(`/api/invoices/${result.invoice.id}/pdf`);

      console.log('[PDF Download] PDF generation response status:', pdfResponse.status);

      if (!pdfResponse.ok) {
        const errorData = await pdfResponse.json();
        console.error('[PDF Download] PDF generation failed:', errorData);
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      // Step 3: Download PDF
      console.log('[PDF Download] Step 3: Downloading PDF blob...');
      const blob = await pdfResponse.blob();
      console.log('[PDF Download] PDF blob size:', blob.size, 'bytes');

      if (blob.size === 0) {
        throw new Error('Generated PDF is empty');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.invoice.invoice_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log('[PDF Download] PDF downloaded successfully');
    } catch (error) {
      console.error('[PDF Download] Error:', error);
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
      <LoginPrompt show={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />

      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center px-6 pt-28 pb-16 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[rgba(200,245,66,0.12)] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm text-muted-foreground mb-10">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-semibold">12,847 invoices generated this month</span> · <span className="text-primary font-bold">Join 3,254+ freelancers</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5 tracking-tight text-foreground">
                $ ai --generate<br />
                <span className="text-primary">invoice</span> --now
              </h1>

              {/* Subheadline */}
              <p className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed font-mono">
                Tell us what you did, who it&apos;s for, and how much. AI handles the rest. Used by freelancers in 127 countries.
              </p>

              {/* CTA */}
              <div className="flex flex-col items-center lg:items-start gap-2">
                <button
                  onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
                  className="group px-8 py-4 bg-primary text-primary-foreground rounded-[10px] font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 glow-accent flex items-center gap-2"
                >
                  $ start-generater --free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-sm text-muted-foreground">Natural language → Professional PDF · 99.8% success rate</p>
              </div>
            </div>

            {/* Right: Stats Chart */}
            <div className="bg-card border border-border rounded-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Total Invoices Generated</h3>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">12,847</p>
                  <p className="text-xs text-green-500 font-semibold">+28.5% vs last month</p>
                </div>
              </div>
              <StatsChart width={600} height={200} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <StatsCard />
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
          <div className="bg-card p-8 border border-border rounded-[10px] hover:border-primary/30 transition-colors relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-[10px] text-muted-foreground/20 font-bold group-hover:text-primary/20 transition-colors">0x01</div>
            <h3 className="text-base font-bold mb-3 flex items-center gap-2 text-primary">
              <span className="text-muted-foreground">$</span> describe
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-mono">
              Tell us what you did in plain English. AI extracts items and amounts.
            </p>
          </div>

          <div className="bg-card p-8 border border-border rounded-[10px] hover:border-primary/30 transition-colors relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-[10px] text-muted-foreground/20 font-bold group-hover:text-primary/20 transition-colors">0x02</div>
            <h3 className="text-base font-bold mb-3 flex items-center gap-2 text-primary">
              <span className="text-muted-foreground">$</span> process --smart
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-mono">
              Client details, invoice numbers, taxes — structured automatically.
            </p>
          </div>

          <div className="bg-card p-8 border border-border rounded-[10px] hover:border-primary/30 transition-colors relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-[10px] text-muted-foreground/20 font-bold group-hover:text-primary/20 transition-colors">0x03</div>
            <h3 className="text-base font-bold mb-3 flex items-center gap-2 text-primary">
              <span className="text-muted-foreground">$</span> deploy --pdf
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-mono">
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

              <div className="mt-5 text-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[Page] Download button CLICKED!');
                    console.log('[Page] Session:', session ? 'exists' : 'null');
                    console.log('[Page] Session user:', session?.user ? 'exists' : 'null');
                    console.log('[Page] isDownloading:', isDownloading);
                    console.log('[Page] invoiceData:', invoiceData ? 'exists' : 'null');
                    handleDownload();
                  }}
                  disabled={isDownloading}
                  className="btn-primary cursor-pointer"
                >
                  {isDownloading ? 'Downloading...' : (invoiceData ? 'Download Generated PDF' : 'Download Sample PDF')}
                </button>
                {!invoiceData && (
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Generate an invoice to download your custom PDF
                  </p>
                )}
              </div>
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
