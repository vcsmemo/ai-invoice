'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, Mail, ArrowRight, X, Loader2, CheckCircle2 } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<'google' | 'email' | null>(null);

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // Check for error in URL
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      setError('Authentication failed. Please try again.');
    }
  }, [searchParams]);

  const handleGoogleSignIn = async () => {
    setMethod('google');
    setIsSubmitting(true);
    setError(null);

    try {
      await signIn('google', { callbackUrl });
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMethod('email');
    setIsSubmitting(true);
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await signIn('email', {
        email,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError('Failed to send magic link. Please try again.');
        setIsSubmitting(false);
      } else {
        setIsEmailSent(true);
      }
    } catch (err) {
      setError('Failed to send magic link. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[rgba(200,245,66,0.08)] rounded-full blur-[120px] pointer-events-none" />
        </div>

        {/* Close button */}
        <button
          onClick={() => router.push('/')}
          className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Card */}
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground text-center mb-2">
              Check your email
            </h1>

            {/* Message */}
            <p className="text-muted-foreground text-center mb-6">
              We sent a magic link to <strong>{email}</strong>
            </p>

            <p className="text-sm text-muted-foreground text-center mb-8">
              Click the link in the email to sign in. The link expires in 24 hours.
            </p>

            {/* Resend */}
            <div className="text-center">
              <button
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail('');
                }}
                className="text-sm text-primary hover:underline font-medium"
              >
                Use a different email address
              </button>
            </div>

            {/* Back to home */}
            <div className="mt-8 pt-6 border-t border-border text-center">
              <button
                onClick={() => router.push('/')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[rgba(200,245,66,0.08)] rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Close button */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted z-20"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground text-center mb-2">
            Welcome back
          </h1>

          <p className="text-muted-foreground text-center mb-8">
            Sign in to create professional invoices with AI
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-foreground text-background rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01] active:scale-[0.99] mb-3"
          >
            {isSubmitting && method === 'google' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Email Sign In Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {isSubmitting && method === 'email' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send magic link
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="w-8 h-8 mx-auto mb-1.5 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-[10px] text-muted-foreground font-medium leading-tight">Free credits</p>
              </div>
              <div>
                <div className="w-8 h-8 mx-auto mb-1.5 bg-blue-50 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-[10px] text-muted-foreground font-medium leading-tight">AI powered</p>
              </div>
              <div>
                <div className="w-8 h-8 mx-auto mb-1.5 bg-purple-50 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-[10px] text-muted-foreground font-medium leading-tight">No spam</p>
              </div>
            </div>
          </div>

          {/* Terms */}
          <p className="mt-6 text-[10px] text-center text-muted-foreground leading-relaxed">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-primary hover:underline">Terms</a>
            {' '}and{' '}
            <a href="/privacy" className="text-primary hover:underline">Privacy</a>
          </p>
        </div>

        {/* Social Proof */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Join <span className="font-semibold text-foreground">3,254+</span> freelancers worldwide
          </p>
        </div>
      </div>
    </div>
  );
}
