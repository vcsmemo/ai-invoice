'use client';

import { useState } from 'react';
import { CheckCircle2, Sparkles, Clock, Shield, Zap, ArrowRight, Star, Users, TrendingUp, Terminal, Code2, FileCode } from 'lucide-react';
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
      // Check if user is authenticated
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
          // Redirect to sign in
          window.location.href = '/api/auth/signin';
          return;
        }
        if (response.status === 403) {
          alert(data.error || 'No credits remaining. Please purchase more credits.');
          // Redirect to pricing
          window.location.href = '/pricing';
          return;
        }
        throw new Error(data.error || 'Failed to create invoice');
      }

      const result = await response.json();

      // Download PDF
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

  // Sample invoice data for template preview
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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section - Code Style */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* File Header */}
          <div className="mb-6 flex items-center gap-2 text-sm">
            <span className="text-gray-500">//</span>
            <span className="text-green-400">main.tsx</span>
            <span className="text-gray-500">•</span>
            <span className="text-blue-400">AI Invoice Generator</span>
          </div>

          {/* Code Block */}
          <div className="bg-gray-950 rounded-xl border border-gray-700 p-8 mb-8 font-mono">
            <div className="mb-4">
              <span className="text-gray-500">{'/*'}</span>
              <span className="text-gray-300"> Generate professional invoices</span>
              <br />
              <span className="text-gray-300"> in seconds with AI</span>
              <br />
              <span className="text-gray-500">{'*/'}</span>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-purple-400">const</span>
                <span className="text-blue-300"> invoiceGenerator</span>
                <span className="text-white"> = {'{'}</span>
              </div>
              <div className="pl-6">
                <span className="text-amber-300">speed</span>
                <span className="text-white">: </span>
                <span className="text-green-400">'60s'</span>
                <span className="text-white">,</span>
              </div>
              <div className="pl-6">
                <span className="text-amber-300">format</span>
                <span className="text-white">: </span>
                <span className="text-green-400">'professional PDF'</span>
                <span className="text-white">,</span>
              </div>
              <div className="pl-6">
                <span className="text-amber-300">input</span>
                <span className="text-white">: </span>
                <span className="text-green-400">'plain English'</span>
                <span className="text-white">,</span>
              </div>
              <div className="pl-6">
                <span className="text-amber-300">registration</span>
                <span className="text-white">: </span>
                <span className="text-orange-400">false</span>
                <span className="text-white">,</span>
              </div>
              <div>
                <span className="text-white">};</span>
              </div>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="bg-black rounded-xl border border-gray-700 p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-gray-500">terminal</span>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-green-400">$</span>
                <span className="text-white"> npm install invoice-ai</span>
              </div>
              <div className="text-gray-400">
                + invoice-ai@3.2.1 installed
              </div>
              <div>
                <span className="text-green-400">$</span>
                <span className="text-white"> invoice generate --ai</span>
              </div>
              <div className="text-green-400">
                ✓ Invoice generated successfully
              </div>
              <div className="text-gray-400">
                → Ready to download as PDF
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tool Section - Fixed height */}
      <section className="bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          {/* Section Header - Code Style */}
          <div className="mb-6 font-mono">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">//</span>
              <span className="text-blue-400">app</span>
              <span className="text-gray-500">/</span>
              <span className="text-green-400">generate</span>
              <span className="text-gray-500">/</span>
              <span className="text-yellow-300">page.tsx</span>
            </div>
          </div>

          <div className="flex gap-6 h-[700px]">
            {/* Left Panel - Chat Interface */}
            <div className="w-[38%] min-w-[400px] flex flex-col bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden">
              {/* Chat Header - Code Style */}
              <div className="px-6 py-4 border-b border-gray-300 bg-gray-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                    <Terminal className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 font-mono">AI.process()</h2>
                    <p className="text-xs text-gray-500 flex items-center gap-1 font-mono">
                      <span className="text-green-500">●</span>
                      <span className="text-green-600">online</span>
                      <span className="text-gray-400">• ready</span>
                    </p>
                  </div>
                </div>

                {/* Example prompts - Code Style */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 font-mono">// Quick examples:</p>
                  {[
                    { emoji: '💼', text: 'ABC Company, 20 hours web dev, $100/hour' },
                    { emoji: '🎨', text: 'Logo design for StartupXYZ, $500 flat fee' },
                  ].map((example, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const input = document.querySelector('textarea') as HTMLTextAreaElement;
                        if (input) {
                          input.value = example.text;
                          input.dispatchEvent(new Event('input', { bubbles: true }));
                          input.focus();
                        }
                      }}
                      className="w-full text-left px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-300 font-mono hover:bg-gray-800 hover:border-green-600 transition-all font-mono"
                    >
                      <span className="text-gray-500">{'>'}</span> {example.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Interface */}
              <div className="flex-1 flex flex-col">
                <ChatInterface
                  onInvoiceGenerated={handleInvoiceGenerated}
                  isLoading={isDownloading}
                />
              </div>
            </div>

            {/* Right Panel - Invoice Preview */}
            <div className="w-[62%] flex flex-col bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden">
              {invoiceData ? (
                <>
                  {/* Success Banner - Code Style */}
                  <div className="bg-gray-900 border-b border-green-700 px-6 py-3">
                    <div className="flex items-center justify-between font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span className="text-sm text-green-400">response.status = 200</span>
                      </div>
                      <span className="text-xs text-gray-400">invoice/generated.json →</span>
                    </div>
                  </div>

                  {/* Invoice Content */}
                  <div className="flex-1 overflow-auto p-6">
                    <div className="max-w-3xl mx-auto">
                      <InvoicePreview
                        invoiceData={invoiceData}
                        onEdit={setInvoiceData}
                        onDownload={handleDownload}
                        isDownloading={isDownloading}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Preview Banner - Code Style */}
                  <div className="bg-gray-900 border-b border-gray-700 px-6 py-3">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-yellow-400">//</span>
                      <span className="text-sm text-gray-300">components</span>
                      <span className="text-gray-500">/</span>
                      <span className="text-blue-400">InvoicePreview.tsx</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">template view</span>
                    </div>
                  </div>

                  {/* Invoice Preview */}
                  <div className="flex-1 overflow-auto p-6 bg-gray-50">
                    <div className="max-w-3xl mx-auto">
                      <div className="mb-6 font-mono">
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                          <div className="text-gray-400 text-xs mb-2">{'/*'}</div>
                          <div className="text-gray-300 text-xs mb-1">  Invoice Template</div>
                          <div className="text-gray-300 text-xs mb-1">  Professional format</div>
                          <div className="text-gray-400 text-xs">{'*/'}</div>
                        </div>
                      </div>

                      {/* Sample Invoice */}
                      <div className="bg-white rounded-xl shadow-md border border-gray-300 overflow-hidden">
                        {/* Invoice Header - Code Style */}
                        <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                                <FileCode className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 font-mono text-sm">export default Invoice</p>
                                <p className="text-xs text-gray-500 font-mono">#INV-001</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 font-mono mb-1">totalAmount</p>
                              <p className="text-2xl font-bold text-green-600 font-mono">${sampleInvoice.total.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Invoice Body */}
                        <div className="p-8 space-y-6">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Bill To</p>
                            <p className="font-semibold text-gray-900">{sampleInvoice.customer.name}</p>
                            <p className="text-sm text-gray-600">{sampleInvoice.customer.company}</p>
                          </div>

                                                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Line Items</p>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                              <table className="w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Description</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 w-20">Qty</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 w-28">Price</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 w-28">Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sampleInvoice.items.map((item, index) => (
                                    <tr key={index} className="border-t border-gray-200">
                                      <td className="px-4 py-3">
                                        <span className="text-sm text-gray-900">{item.description}</span>
                                      </td>
                                      <td className="px-4 py-3 text-center text-sm text-gray-900">{item.quantity}</td>
                                      <td className="px-4 py-3 text-right text-sm text-gray-900">${item.unitPrice.toFixed(2)}</td>
                                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">${item.total.toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <div className="w-56 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold text-gray-900">${sampleInvoice.subtotal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax ({sampleInvoice.tax?.rate}%)</span>
                                <span className="font-semibold text-gray-900">${sampleInvoice.tax?.amount.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-lg font-bold pt-3 border-t-2 border-gray-200">
                                <span className="text-gray-900">Total</span>
                                <span className="text-gray-900">${sampleInvoice.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA - Code Style */}
                      <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-700 font-mono">
                        <div className="text-gray-400 text-xs mb-4">// Ready to generate?</div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-blue-400">await</span>
                            <span className="text-green-400"> invoice</span>
                            <span className="text-white">.</span>
                            <span className="text-yellow-300">generate</span>
                            <span className="text-white">({</span>
                          </div>
                          <div className="pl-4 text-xs">
                            <span className="text-amber-300">input</span>
                            <span className="text-white">: </span>
                            <span className="text-green-400">'Your work description'</span>
                            <span className="text-white">,</span>
                          </div>
                          <div>
                            <span className="text-white">});</span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-green-400">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>AI waiting for input...</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features Bar - Code Style */}
                  <div className="border-t border-gray-300 bg-gray-100 px-6 py-4">
                    <div className="grid grid-cols-3 gap-4 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">⚡</span>
                        <div>
                          <p className="font-bold text-gray-900">O(1) generation</p>
                          <p className="text-gray-600">&lt; 60s response</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <div>
                          <p className="font-bold text-gray-900">type: 'PDF'</p>
                          <p className="text-gray-600">professional export</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-500">⏱</span>
                        <div>
                          <p className="font-bold text-gray-900">time.save()</p>
                          <p className="text-gray-600">focus on work</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - SEO Content */}
      <section className="bg-white border-t border-gray-300">
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Section Header - Code Style */}
          <div className="text-center mb-12 font-mono">
            <div className="inline-block bg-gray-900 rounded-xl px-6 py-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">//</span>
                <span className="text-blue-400">features</span>
                <span className="text-gray-500">/</span>
                <span className="text-green-400">index.tsx</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              <span className="text-purple-400">export const</span> <span className="text-blue-400">features</span> <span className="text-white">= []</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm">
              <span className="text-gray-500">/*</span>
              <span className="text-gray-300"> Stop wasting time on manual invoice creation</span>
              <span className="text-gray-500">*/</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-700 font-mono">
              <div className="text-xs text-gray-500 mb-4">/* 01 */</div>
              <div className="mb-4">
                <span className="text-blue-400">const</span>
                <span className="text-green-400"> speed</span>
                <span className="text-white"> = </span>
                <span className="text-amber-300">'</span><span className="text-amber-300">60s</span><span className="text-amber-300">'</span>
              </div>
              <h3 className="text-sm font-bold text-gray-300 mb-3">O(1) Invoice Generation</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Create professional invoices in constant time. AI instantly formats everything perfectly.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-8 border border-gray-700 font-mono">
              <div className="text-xs text-gray-500 mb-4">/* 02 */</div>
              <div className="mb-4">
                <span className="text-blue-400">const</span>
                <span className="text-green-400"> format</span>
                <span className="text-white"> = </span>
                <span className="text-amber-300">'</span><span className="text-amber-300">professional PDF</span><span className="text-amber-300">'</span>
              </div>
              <h3 className="text-sm font-bold text-gray-300 mb-3">Professional Export</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Industry-standard formats that impress clients. Ready-to-download PDF exports with automatic calculations.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-8 border border-gray-700 font-mono">
              <div className="text-xs text-gray-500 mb-4">/* 03 */</div>
              <div className="mb-4">
                <span className="text-blue-400">const</span>
                <span className="text-green-400"> target</span>
                <span className="text-white"> = </span>
                <span className="text-amber-300">'</span><span className="text-amber-300">freelancers</span><span className="text-amber-300">'</span>
              </div>
              <h3 className="text-sm font-bold text-gray-300 mb-3">Built for Developers</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Designed for designers, developers, consultants. Get paid faster with professional invoices.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-10 font-mono">
              <span className="text-purple-400">function</span> <span className="text-blue-400">howItWorks</span><span className="text-white">() {</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  code: 'invoice.describe()',
                  title: 'Describe Your Work',
                  description: 'Type naturally: "20 hours of web development for ABC Company at $100/hour"',
                },
                {
                  step: '02',
                  code: 'await AI.generate()',
                  title: 'AI Creates Invoice',
                  description: 'Our AI instantly extracts customer info, line items, and calculates totals automatically',
                },
                {
                  step: '03',
                  code: 'pdf.download()',
                  title: 'Download PDF',
                  description: 'Review, edit if needed, and download your professional invoice as PDF',
                },
              ].map((item) => (
                <div key={item.step} className="relative">
                  <div className="bg-gray-900 rounded-xl p-8 border border-gray-700 font-mono shadow-md hover:shadow-xl transition-shadow">
                    <div className="text-xs text-gray-500 mb-4">/* {item.step} */</div>
                    <div className="text-green-400 text-sm mb-4">{item.code}</div>
                    <h4 className="text-sm font-bold text-gray-300 mb-3">{item.title}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8 font-mono text-gray-500">}</div>
          </div>

          {/* Use Cases - SEO */}
          <div className="bg-gray-900 rounded-xl p-12 border border-gray-700">
            <h3 className="text-xl font-bold text-gray-300 text-center mb-8 font-mono">
              <span className="text-purple-400">const</span> <span className="text-blue-400">useCases</span> <span className="text-white">= [</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '💻', title: 'Web Developers', desc: 'Bill for coding, debugging, and maintenance', var: 'webDevs' },
                { icon: '🎨', title: 'Designers', desc: 'UI/UX, graphic design, branding projects', var: 'designers' },
                { icon: '✍️', title: 'Consultants', desc: 'Strategy, marketing, business consulting', var: 'consultants' },
                { icon: '📊', title: 'Agencies', desc: 'Project-based work and retainers', var: 'agencies' },
              ].map((use, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-600 transition-colors font-mono">
                  <div className="text-xs text-gray-500 mb-2">// {use.var}</div>
                  <div className="text-2xl mb-3">{use.icon}</div>
                  <h4 className="font-bold text-gray-300 text-sm mb-2">{use.title}</h4>
                  <p className="text-xs text-gray-400">{use.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8 font-mono text-gray-500">];</div>
          </div>
        </div>
      </section>

      {/* CTA Section - Code Style */}
      <section className="bg-gray-900 border-t border-gray-700 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 font-mono">
            <div className="mb-4">
              <span className="text-gray-400 text-sm">{'/*'}</span>
            </div>
            <div className="text-gray-300 text-sm mb-2">  Ready to start?</div>
            <div className="text-gray-400 text-sm mb-6">{'*/'}</div>

            <div className="space-y-2 text-left max-w-md mx-auto mb-6">
              <div>
                <span className="text-blue-400">await</span>
                <span className="text-green-400"> invoice</span>
                <span className="text-white">.</span>
                <span className="text-yellow-300">create</span>
                <span className="text-white">({</span>
              </div>
              <div className="pl-4">
                <span className="text-amber-300">cost</span>
                <span className="text-white">: </span>
                <span className="text-green-400">'FREE'</span>
                <span className="text-white">,</span>
              </div>
              <div className="pl-4">
                <span className="text-amber-300">credits</span>
                <span className="text-white">: </span>
                <span className="text-orange-400">3</span>
                <span className="text-white">,</span>
              </div>
              <div>
                <span className="text-white">});</span>
              </div>
            </div>

            <button
              onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg font-mono text-sm hover:bg-green-700 transition-colors border border-green-500"
            >
              <span className="text-green-300">$</span>
              <span>start</span>
              <span className="text-gray-300">--free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-gray-500 mt-4 font-mono">// No credit card required</p>
          </div>
        </div>
      </section>

      {/* Footer - Code Style */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 font-mono">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-white text-sm">invoice-generator.ts</span>
              </div>
              <p className="text-xs text-gray-500">{'/*'} AI-powered invoicing {'*/'}</p>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-4">// Product</div>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="text-gray-400 hover:text-green-400 transition-colors">features.ts</a></li>
                <li><a href="/pricing" className="text-gray-400 hover:text-green-400 transition-colors">pricing.json</a></li>
                <li><a href="/my-invoices" className="text-gray-400 hover:text-green-400 transition-colors">invoices/</a></li>
              </ul>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-4">// Resources</div>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">docs/</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">api.ts</a></li>
              </ul>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-4">// Legal</div>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">privacy.md</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">terms.md</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-xs">
            <p className="text-gray-600">// © 2024 • Built with Next.js + Claude AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
