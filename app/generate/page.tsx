'use client';

import { useState } from 'react';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import InvoicePreview from '@/components/InvoicePreview';
import Navbar from '@/components/Navbar';
import { InvoiceData } from '@/lib/supabase';
import Link from 'next/link';

export default function GeneratePage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleInvoiceGenerated = (data: InvoiceData) => {
    setInvoiceData(data);
  };

  const handleDownload = async () => {
    if (!invoiceData) return;

    setIsDownloading(true);
    try {
      alert(`PDF generation will be integrated next!\n\nInvoice Total: $${invoiceData.total.toFixed(2)}`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <Navbar />

      {/* Simple Back Bar */}
      <div className="border-b border-gray-200 px-6 py-3 flex items-center gap-4 bg-white">
        <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="h-4 w-px bg-gray-200"></div>
        <h1 className="text-sm font-medium text-gray-900">Generate Invoice</h1>
      </div>

      {/* Main Content - Split View */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat Input */}
        <div className="w-1/2 min-w-[400px] border-r border-gray-200 flex flex-col">
          <ChatInterface
            onInvoiceGenerated={handleInvoiceGenerated}
            isLoading={isDownloading}
          />
        </div>

        {/* Right Panel - Invoice Preview */}
        <div className="w-1/2 flex flex-col bg-gray-50">
          {invoiceData ? (
            <div className="flex-1 overflow-auto p-6">
              <InvoicePreview
                invoiceData={invoiceData}
                onEdit={setInvoiceData}
                onDownload={handleDownload}
                isDownloading={isDownloading}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Start chatting
                </h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Describe your work on the left and AI will create a professional invoice here
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
