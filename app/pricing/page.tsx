'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Check, CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { CREDIT_PACKAGES, type CreditPackage } from '@/lib/stripe';

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handlePurchase = async (packageId: CreditPackage) => {
    if (!session?.user) {
      router.push('/signin?callbackUrl=/pricing');
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

      // Open Stripe checkout in new tab
      window.open(data.checkoutUrl, '_blank', 'noopener,noreferrer');
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-8 shadow-sm">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Simple, Transparent Pricing</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Pay only for<br />what you use
          </h1>

          <p className="text-base text-muted-foreground font-mono max-w-xl mx-auto mb-8">
            No monthly subscriptions. Buy credits when you need them. Credits never expire.
          </p>

          {session?.user && (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-xl shadow-sm">
              <div className="text-left">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Your Credits</p>
                <p className="text-2xl font-bold text-foreground">{session.user.credits_remaining}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Success Message */}
      {success === 'true' && (
        <div className="border-b border-primary/20 bg-primary/5">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg glow-accent">
                <Check className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-foreground">Payment Successful!</p>
                <p className="text-sm text-muted-foreground font-mono">Your credits have been added to your account.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Canceled Message */}
      {canceled === 'true' && (
        <div className="border-b border-border">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <p className="text-center text-muted-foreground font-mono text-sm">
              Payment canceled. You can try again whenever you're ready.
            </p>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Choose your credit package</h2>
            <p className="text-muted-foreground font-mono text-sm">Buy credits once, use them whenever you need</p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border shadow-sm">
            {/* Starter Pack */}
            <div className="bg-card p-8 hover:bg-muted/10 transition-colors group">
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-1.5 uppercase tracking-tight">Starter Pack</h3>
                <p className="text-sm text-muted-foreground font-mono">Perfect for getting started</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold text-foreground">$9</span>
                  <span className="text-sm text-muted-foreground font-mono">one-time</span>
                </div>
                <p className="text-3xl font-bold text-primary uppercase tracking-tighter">10 Credits</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Create 10 professional invoices</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-medium">PDF download included</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Credits never expire</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-medium">No subscription required</span>
                </li>
              </ul>

              <button
                onClick={() => handlePurchase('starter')}
                disabled={isLoading !== null}
                className="w-full btn-secondary shadow-sm"
              >
                {isLoading === 'starter' ? 'Processing...' : 'Buy Now'}
              </button>

              <p className="text-[10px] font-bold text-muted-foreground text-center mt-4 uppercase tracking-widest opacity-70">$0.90 per invoice</p>
            </div>

            {/* Professional Pack - Popular */}
            <div className="bg-card p-8 hover:bg-muted/10 transition-colors relative group z-10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <div className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg glow-accent">
                  Most Popular
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold mb-1.5 uppercase tracking-tight">Professional Pack</h3>
                <p className="text-sm text-muted-foreground font-mono">Best value for freelancers</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold text-foreground">$35</span>
                  <span className="text-sm text-muted-foreground font-mono">one-time</span>
                </div>
                <p className="text-3xl font-bold text-primary uppercase tracking-tighter">50 Credits</p>
                <div className="inline-block px-2 py-0.5 bg-primary/10 rounded mt-2">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Save 22%</p>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-bold">Create 50 professional invoices</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-medium">PDF download included</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Credits never expire</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-medium">No subscription required</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm font-bold text-primary uppercase tracking-wider">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Best price per invoice</span>
                </li>
              </ul>

              <button
                onClick={() => handlePurchase('professional')}
                disabled={isLoading !== null}
                className="w-full btn-primary shadow-lg glow-accent"
              >
                {isLoading === 'professional' ? 'Processing...' : 'Buy Now'}
              </button>

              <p className="text-[10px] font-bold text-muted-foreground text-center mt-4 uppercase tracking-widest opacity-70">$0.70 per invoice</p>
            </div>

            {/* Business Pack */}
            <div className="bg-card p-8 hover:bg-muted/10 transition-colors group">
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-1.5 uppercase tracking-tight">Business Pack</h3>
                <p className="text-sm text-muted-foreground font-mono">Maximum savings</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold text-foreground">$59</span>
                  <span className="text-sm text-muted-foreground font-mono">one-time</span>
                </div>
                <p className="text-3xl font-bold text-primary uppercase tracking-tighter">100 Credits</p>
                <div className="inline-block px-2 py-0.5 bg-primary/10 rounded mt-2">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Save 34%</p>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Create 100 professional invoices</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-medium">PDF download included</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Credits never expire</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-medium">No subscription required</span>
                </li>
              </ul>

              <button
                onClick={() => handlePurchase('business')}
                disabled={isLoading !== null}
                className="w-full btn-secondary shadow-sm"
              >
                {isLoading === 'business' ? 'Processing...' : 'Buy Now'}
              </button>

              <p className="text-[10px] font-bold text-muted-foreground text-center mt-4 uppercase tracking-widest opacity-70">$0.59 per invoice</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10 tracking-tight uppercase">
              FAQs
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
                <div key={i} className="bg-card p-6 rounded-xl border border-border shadow-sm">
                  <h3 className="font-bold text-foreground mb-2 font-mono text-sm uppercase tracking-tight">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground font-mono leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 mt-auto bg-card/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <span>© 2026 AI Invoice Generator</span>
          <div className="flex gap-8">
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
