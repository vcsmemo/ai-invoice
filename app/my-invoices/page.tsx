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
      console.log('[MyInvoices] PDF blob size:', blob.size, 'bytes');

      // Create download link with detailed logging
      console.log('[MyInvoices] Creating object URL...');
      const url = window.URL.createObjectURL(blob);
      console.log('[MyInvoices] Object URL created:', url);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
      a.style.display = 'none';
      // Add attributes to ensure download works
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');

      console.log('[MyInvoices] Appending link to DOM...');
      document.body.appendChild(a);

      // Try multiple click methods to ensure download triggers
      console.log('[MyInvoices] Triggering click on download link...');
      a.click();

      // Fallback: create mouse event
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      a.dispatchEvent(clickEvent);

      // Small delay to ensure download starts
      await new Promise(resolve => setTimeout(resolve, 200));

      console.log('[MyInvoices] Removing link from DOM...');
      document.body.removeChild(a);

      console.log('[MyInvoices] Revoking object URL...');
      window.URL.revokeObjectURL(url);

      console.log('[MyInvoices] ✅ Download completed!');

      // Show success message
      alert(`✅ PDF下载成功！\n\n文件名：${invoiceNumber}.pdf\n\n请查看浏览器的下载文件夹。`);
    } catch (error) {
      console.error('[MyInvoices] Error downloading PDF:', error);
      alert('PDF下载失败，请重试。');
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
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-10 px-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-5 shadow-sm">
                <FileText className="w-3.5 h-3.5" />
                <span>My Invoices</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Manage your invoices</h1>
              <p className="text-muted-foreground font-mono text-sm">View, download, and track all your generated invoices</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-5 py-3 bg-card border border-border rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Credits</p>
                    <p className="text-xl font-bold text-foreground">{session?.user?.credits_remaining || 0}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push('/')}
                className="btn-primary flex items-center gap-2 h-fit"
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
            <div className="bg-card rounded-xl border border-border p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No invoices yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto font-mono text-sm">Create your first professional AI-generated invoice</p>
              <button
                onClick={() => router.push('/')}
                className="btn-primary inline-flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Create Your First Invoice
              </button>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/30">
                    <tr>
                      <th className="px-5 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Invoice
                      </th>
                      <th className="px-5 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Customer
                      </th>
                      <th className="px-5 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Date
                      </th>
                      <th className="px-5 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Amount
                      </th>
                      <th className="px-5 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {invoices.map((invoice, index) => (
                      <tr key={invoice.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              <FileText className="w-5 h-5 text-primary group-hover:text-inherit" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-foreground">{invoice.invoice_number}</p>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{invoice.invoice_data.items.length} items</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-bold text-sm text-foreground">
                            {invoice.invoice_data.customer.name}
                          </p>
                          {invoice.invoice_data.customer.company && (
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              {invoice.invoice_data.customer.company}
                             </p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-foreground">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span className="text-xs font-mono">{formatDate(invoice.created_at)}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 text-foreground font-bold">
                            <span className="text-xs text-muted-foreground">$</span>
                            <span className="text-sm">
                              {invoice.invoice_data.total.toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDownload(invoice.id, invoice.invoice_number)}
                              disabled={downloadingId === invoice.id}
                              className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-primary/20"
                              title="Download PDF"
                            >
                              {downloadingId === invoice.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
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
            <div className="bg-card rounded-xl p-8 border border-border flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1 uppercase tracking-tight">Running low on credits?</h3>
                <p className="text-sm text-muted-foreground font-mono">Purchase more and keep creating professional invoices</p>
              </div>
              <button
                onClick={() => router.push('/pricing')}
                className="btn-primary flex items-center gap-2 group shadow-lg glow-accent"
              >
                <DollarSign className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Get More Credits
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
