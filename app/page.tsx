'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import InvoicePreview from '@/components/InvoicePreview';
import Navbar from '@/components/Navbar';
import { InvoiceData } from '@/lib/supabase';

export default function Home() {
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
    customer: {
      name: 'ABC Company',
      company: 'ABC Inc.',
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
      number: 'INV-001',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgb(16,16,16)] text-xs text-[rgb(180,180,180)] mb-10">
            Free to start · <span className="text-[rgb(200,245,66)]">No credit card</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-semibold leading-tight mb-5 max-w-4xl mx-auto">
            Describe it,<br />
            we <em className="text-[rgb(200,245,66)] not-italic">invoice</em> it.
          </h1>

          {/* Subheadline */}
          <p className="text-base text-[rgb(180,180,180)] max-w-lg mx-auto mb-10 leading-relaxed">
            Tell us what you did, who it's for, and how much. AI handles the rest.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
              className="group px-6 py-3 bg-[rgb(200,245,66)] text-[rgb(8,8,8)] rounded-full font-semibold text-sm hover:scale-[1.02] transition-all duration-200 glow-accent-strong flex items-center gap-2"
            >
              Start creating free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-[rgb(120,120,120)]">Natural language → Professional PDF</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full">
        <div className="mb-12">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(200,245,66)] mb-3">How it works</div>
          <h2 className="text-3xl md:text-4xl font-semibold">Three steps.<br />Zero friction.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
          <div className="bg-[rgb(16,16,16)] p-8 hover:bg-[rgb(20,20,20)] transition-colors">
            <div className="text-4xl text-[rgb(200,245,66)] opacity-40 mb-4 font-serif">01</div>
            <h3 className="text-base font-semibold mb-2">Describe your work</h3>
            <p className="text-sm text-[rgb(180,180,180)] leading-relaxed">
              Type what you did, who the client is, the amount — in plain English.
            </p>
          </div>

          <div className="bg-[rgb(16,16,16)] p-8 hover:bg-[rgb(20,20,20)] transition-colors">
            <div className="text-4xl text-[rgb(200,245,66)] opacity-40 mb-4 font-serif">02</div>
            <h3 className="text-base font-semibold mb-2">AI fills everything</h3>
            <p className="text-sm text-[rgb(180,180,180)] leading-relaxed">
              Client details, invoice number, line items, taxes — extracted and structured automatically.
            </p>
          </div>

          <div className="bg-[rgb(16,16,16)] p-8 hover:bg-[rgb(20,20,20)] transition-colors">
            <div className="text-4xl text-[rgb(200,245,66)] opacity-40 mb-4 font-serif">03</div>
            <h3 className="text-base font-semibold mb-2">Send it</h3>
            <p className="text-sm text-[rgb(180,180,180)] leading-relaxed">
              Download as PDF, send via email, or share a payment link. One click.
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
              <ChatInterface onInvoiceGenerated={handleInvoiceGenerated} />
            </div>

            {/* Invoice Preview */}
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
      <section className="py-20 px-6 text-center relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[350px] h-[250px] bg-[rgba(200,245,66,0.12)] rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Stop wasting time <em className="text-[rgb(200,245,66)] not-italic">making invoices</em>.
          </h2>
          <p className="text-[rgb(180,180,180)] mb-7">5 free invoices per month. Upgrade when you're ready.</p>

          <button
            onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
            className="group px-6 py-3 bg-[rgb(200,245,66)] text-[rgb(8,8,8)] rounded-full font-semibold text-sm hover:scale-[1.02] transition-all duration-200 glow-accent-strong inline-flex items-center gap-2"
          >
            Start generating
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-xs text-[rgb(120,120,120)] mt-3">No account required for first invoice</p>
        </div>
      </section>
    </div>
  );
}
