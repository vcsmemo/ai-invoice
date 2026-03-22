'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Download, FileText, Calendar, DollarSign } from 'lucide-react';
import { Invoice } from '@/lib/supabase';

export default function MyInvoicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchInvoices();
    }
  }, [status, router]);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/user/invoices');
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (invoiceId: string, invoiceNumber: string) => {
    setDownloadingId(invoiceId);

    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`);
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[rgb(200,245,66)]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgb(16,16,16)] text-xs text-[rgb(180,180,180)] mb-5">
                <FileText className="w-3.5 h-3.5" />
                <span>My Invoices</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold mb-2">Manage your invoices</h1>
              <p className="text-[rgb(180,180,180)]">View, download, and track all your generated invoices</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-5 py-3 bg-[rgb(16,16,16)] border border-[rgba(255,255,255,0.08)] rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-[rgba(200,245,66,0.1)] rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[rgb(200,245,66)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[rgb(180,180,180)]">Credits</p>
                    <p className="text-xl font-bold text-[rgb(250,250,250)]">{session?.user?.credits_remaining || 0}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push('/')}
                className="btn-primary flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Create New
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Invoices List */}
      <section className="flex-1 px-6 pb-10">
        <div className="max-w-7xl mx-auto">
          {invoices.length === 0 ? (
            <div className="bg-[rgb(16,16,16)] rounded-xl border border-[rgba(255,255,255,0.08)] p-12 text-center">
              <div className="w-16 h-16 bg-[rgba(200,245,66,0.1)] rounded-full flex items-center justify-center mx-auto mb-5">
                <FileText className="w-8 h-8 text-[rgb(200,245,66)]" />
              </div>
              <h3 className="text-xl font-semibold text-[rgb(250,250,250)] mb-2">No invoices yet</h3>
              <p className="text-[rgb(180,180,180)] mb-6 max-w-md mx-auto">Create your first professional AI-generated invoice</p>
              <button
                onClick={() => router.push('/')}
                className="btn-primary inline-flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Create Your First Invoice
              </button>
            </div>
          ) : (
            <div className="bg-[rgb(16,16,16)] rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-[rgba(255,255,255,0.08)]">
                    <tr>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-[rgb(180,180,180)] uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-[rgb(180,180,180)] uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-[rgb(180,180,180)] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-[rgb(180,180,180)] uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-[rgb(180,180,180)] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(255,255,255,0.08)]">
                    {invoices.map((invoice, index) => (
                      <tr key={invoice.id} className="hover:bg-[rgb(20,20,20)] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-[rgba(200,245,66,0.1)] rounded-lg flex items-center justify-center">
                              <FileText className="w-4 h-4 text-[rgb(200,245,66)]" />
                            </div>
                            <div>
                              <p className="font-medium text-sm text-[rgb(250,250,250)]">{invoice.invoice_number}</p>
                              <p className="text-xs text-[rgb(180,180,180)]">{invoice.invoice_data.items.length} items</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-sm text-[rgb(250,250,250)]">
                            {invoice.invoice_data.customer.name}
                          </p>
                          {invoice.invoice_data.customer.company && (
                            <p className="text-xs text-[rgb(180,180,180)]">
                              {invoice.invoice_data.customer.company}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 text-[rgb(250,250,250)]">
                            <Calendar className="w-3.5 h-3.5 text-[rgb(200,245,66)]" />
                            <span className="text-xs">{formatDate(invoice.created_at)}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-0.5">
                            <DollarSign className="w-3.5 h-3.5 text-[rgb(200,245,66)]" />
                            <span className="font-semibold text-sm text-[rgb(250,250,250)]">
                              {invoice.invoice_data.total.toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleDownload(invoice.id, invoice.invoice_number)}
                              disabled={downloadingId === invoice.id}
                              className="p-1.5 text-[rgb(180,180,180)] hover:text-[rgb(200,245,66)] hover:bg-[rgba(200,245,66,0.1)] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Download PDF"
                            >
                              {downloadingId === invoice.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[rgb(200,245,66)]"></div>
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Upgrade CTA */}
      {session?.user && session.user.credits_remaining < 3 && (
        <section className="px-6 pb-10">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[rgb(16,16,16)] rounded-xl p-6 border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[rgb(250,250,250)] mb-1">Running low on credits?</h3>
                <p className="text-sm text-[rgb(180,180,180)]">Purchase more and keep creating professional invoices</p>
              </div>
              <button
                onClick={() => router.push('/pricing')}
                className="btn-primary flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Get More Credits
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
