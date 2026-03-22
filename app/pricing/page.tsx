'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Check, CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { CREDIT_PACKAGES, type CreditPackage } from '@/lib/stripe';

export default function PricingPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handlePurchase = async (packageId: CreditPackage) => {
    if (!session?.user) {
      window.location.href = '/api/auth/signin';
      return;
    }

    setIsLoading(packageId);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to initiate checkout');
    } finally {
      setIsLoading(null);
    }
  };

  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const success = urlParams.get('success');
  const canceled = urlParams.get('canceled');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[rgba(200,245,66,0.08)] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgb(16,16,16)] text-xs text-[rgb(180,180,180)] mb-8">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Simple, Transparent Pricing</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold mb-5">
            Pay only for<br />what you use
          </h1>

          <p className="text-base text-[rgb(180,180,180)] max-w-xl mx-auto mb-8">
            No monthly subscriptions. Buy credits when you need them. Credits never expire.
          </p>

          {session?.user && (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-[rgb(16,16,16)] border border-[rgba(255,255,255,0.08)] rounded-xl">
              <div className="text-left">
                <p className="text-xs text-[rgb(180,180,180)]">Your Credits</p>
                <p className="text-2xl font-bold text-[rgb(250,250,250)]">{session.user.credits_remaining}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Success Message */}
      {success === 'true' && (
        <div className="border-b border-[rgba(200,245,66,0.2)] bg-[rgba(200,245,66,0.05)]">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-[rgb(200,245,66)] rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-[rgb(10,10,10)]" />
              </div>
              <div>
                <p className="font-semibold text-[rgb(232,228,223)]">Payment Successful!</p>
                <p className="text-sm text-[rgb(122,118,114)]">Your credits have been added to your account.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Canceled Message */}
      {canceled === 'true' && (
        <div className="border-b border-[rgba(255,255,255,0.06)]">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <p className="text-center text-[rgb(232,228,223)]">
              Payment canceled. You can try again whenever you're ready.
            </p>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">Choose your credit package</h2>
            <p className="text-[rgb(180,180,180)]">Buy credits once, use them whenever you need</p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
            {/* Starter Pack */}
            <div className="bg-[rgb(16,16,16)] p-8 hover:bg-[rgb(20,20,20)] transition-colors">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1.5">Starter Pack</h3>
                <p className="text-sm text-[rgb(180,180,180)]">Perfect for getting started</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold text-[rgb(250,250,250)]">$9</span>
                  <span className="text-sm text-[rgb(180,180,180)]">one-time</span>
                </div>
                <p className="text-3xl font-bold text-[rgb(200,245,66)]">10 Credits</p>
              </div>

              <ul className="space-y-2.5 mb-8">
                <li className="flex items-start gap-2 text-sm text-[rgb(250,250,250)]">
                  <Check className="w-4 h-4 text-[rgb(200,245,66)] flex-shrink-0 mt-0.5" />
                  <span>Create 10 professional invoices</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[rgb(250,250,250)]">
                  <Check className="w-4 h-4 text-[rgb(200,245,66)] flex-shrink-0 mt-0.5" />
                  <span>PDF download included</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[rgb(250,250,250)]">
                  <Check className="w-4 h-4 text-[rgb(200,245,66)] flex-shrink-0 mt-0.5" />
                  <span>Credits never expire</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[rgb(250,250,250)]">
                  <Check className="w-4 h-4 text-[rgb(200,245,66)] flex-shrink-0 mt-0.5" />
                  <span>No subscription required</span>
                </li>
              </ul>

              <button
                onClick={() => handlePurchase('starter')}
                disabled={isLoading !== null}
                className="w-full btn-secondary"
              >
                {isLoading === 'starter' ? 'Processing...' : 'Buy Now'}
              </button>

              <p className="text-xs text-[rgb(180,180,180)] text-center mt-3 opacity-70">$0.90 per invoice</p>
            </div>

            {/* Professional Pack - Popular */}
            <div className="bg-[rgb(16,16,16)] p-8 hover:bg-[rgb(20,20,20)] transition-colors relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="bg-[rgb(200,245,66)] text-[rgb(8,8,8)] px-3 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1.5">Professional Pack</h3>
                <p className="text-sm text-[rgb(180,180,180)]">Best value for freelancers</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold text-[rgb(250,250,250)]">$35</span>
                  <span className="text-sm text-[rgb(180,180,180)]">one-time</span>
                </div>
                <p className="text-3xl font-bold text-[rgb(200,245,66)]">50 Credits</p>
                <p className="text-sm text-[rgb(200,245,66)] font-semibold mt-1.5">Save 22%</p>
              </div>

              <ul className="space-y-2.5 mb-8">
                <li className="flex items-start gap-2 text-sm text-[rgb(250,250,250)]">
                  <Check className="w-4 h-4 text-[rgb(200,245,66)] flex-shrink-0 mt-0.5" />
                  <span>Create 50 professional invoices</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[rgb(250,250,250)]">
                  <Check className="w-4 h-4 text-[rgb(200,245,66)] flex-shrink-0 mt-0.5" />
                  <span>PDF download included</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[rgb(250,250,250)]">
                  <Check className="w-4 h-4 text-[rgb(200,245,66)] flex-shrink-0 mt-0.5" />
                  <span>Credits never expire</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[rgb(250,250,250)]">
                  <Check className="w-4 h-4 text-[rgb(200,245,66)] flex-shrink-0 mt-0.5" />
                  <span>No subscription required</span>
                </li>
                <li className="flex items-start gap-2 text-sm font-semibold text-[rgb(200,245,66)]">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Best price per invoice</span>
                </li>
              </ul>

              <button
                onClick={() => handlePurchase('professional')}
                disabled={isLoading !== null}
                className="w-full btn-primary"
              >
                {isLoading === 'professional' ? 'Processing...' : 'Buy Now'}
              </button>

              <p className="text-xs text-[rgb(180,180,180)] text-center mt-3 opacity-70">$0.70 per invoice</p>
            </div>

            {/* Business Pack */}
            <div className="bg-[rgb(16,16,16)] p-8 hover:bg-[rgb(20,20,20)] transition-colors">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1.5">Business Pack</h3>
                <p className="text-sm text-[rgb(180,180,180)]">Maximum savings</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold text-[rgb(250,250,250)]">$59</span>
                  <span className="text-sm text-[rgb(180,180,180)]">one-time</span>
                </div>
                <p className="text-3xl font-bold text-[rgb(200,245,66)]">100 Credits</p>
                <p className="text-sm text-[rgb(200,245,66)] font-semibold mt-1.5">Save 34%</p>
              </div>

              <ul className="space-y-2.5 mb-8">
                <li className="flex items-start gap-2 text-sm text-[rgb(250,250,250)]">
                  <Check className="w-4 h-4 text-[rgb(200,245,66)] flex-shrink-0 mt-0.5" />
                  <span>Create 100 professional invoices</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[rgb(250,250,250)]">
                  <Check className="w-4 h-4 text-[rgb(200,245,66)] flex-shrink-0 mt-0.5" />
                  <span>PDF download included</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[rgb(250,250,250)]">
                  <Check className="w-4 h-4 text-[rgb(200,245,66)] flex-shrink-0 mt-0.5" />
                  <span>Credits never expire</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[rgb(250,250,250)]">
                  <Check className="w-4 h-4 text-[rgb(200,245,66)] flex-shrink-0 mt-0.5" />
                  <span>No subscription required</span>
                </li>
                <li className="flex items-start gap-2 text-sm font-semibold text-[rgb(200,245,66)]">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Lowest price per invoice</span>
                </li>
              </ul>

              <button
                onClick={() => handlePurchase('business')}
                disabled={isLoading !== null}
                className="w-full btn-secondary"
              >
                {isLoading === 'business' ? 'Processing...' : 'Buy Now'}
              </button>

              <p className="text-xs text-[rgb(180,180,180)] text-center mt-3 opacity-70">$0.59 per invoice</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Do credits expire?',
                  a: 'No, your credits never expire. Use them whenever you need.',
                },
                {
                  q: 'Can I buy credits multiple times?',
                  a: 'Yes! You can purchase credits whenever you need more. They will be added to your existing balance.',
                },
                {
                  q: 'What if I run out of free credits?',
                  a: 'New users get 5 free credits to try the service. After that, you can purchase credit packages based on your needs.',
                },
                {
                  q: 'Is there a subscription?',
                  a: 'No subscriptions! Pay only for what you use with our one-time credit purchases.',
                },
              ].map((faq, i) => (
                <div key={i} className="bg-[rgb(16,16,16)] p-5 rounded-xl border border-[rgba(255,255,255,0.08)]">
                  <h3 className="font-semibold text-[rgb(250,250,250)] mb-1.5">{faq.q}</h3>
                  <p className="text-sm text-[rgb(180,180,180)]">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.08)] py-8 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-[rgb(180,180,180)]">
          <span>© 2026 AI Invoice Generators</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[rgb(250,250,250)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[rgb(250,250,250)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[rgb(250,250,250)] transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
