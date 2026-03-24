'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, LogOut, User, Settings } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { ThemeToggle } from './ThemeToggle';
import Logo from './Logo';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-background/80 backdrop-blur-xl border-b border-border">
      <Logo variant="compact" className="hover:opacity-80 transition-opacity" />

      <div className="flex items-center gap-6">
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/#how';
            }
          }}
          className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
        >
          How It Works
        </button>
        <Link href="/templates" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
          Templates
        </Link>
        <Link href="/pricing" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
          Pricing
        </Link>
        <ThemeToggle />

        {status === 'loading' ? (
          <div className="w-7 h-7 bg-muted rounded-full animate-pulse"></div>
        ) : session?.user ? (
          <div className="flex items-center gap-4">
            <Link href="/generate" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
              Generate
            </Link>
            <Link href="/my-invoices" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
              My Invoices
            </Link>
            <Link href="/settings" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 uppercase tracking-widest">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <div className="flex items-center gap-2">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || ''}
                    className="w-6 h-6 rounded-full border border-border"
                  />
                ) : (
                  <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center border border-border">
                    <User className="w-3 h-3 text-muted-foreground" />
                  </div>
                )}
                <div className="text-[10px] leading-tight font-bold">
                  <p className="text-foreground uppercase tracking-tighter">{session.user.name?.split(' ')[0]}</p>
                  <p className="text-primary">{session.user.credits_remaining}CR</p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-1 text-muted-foreground hover:text-primary transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => router.push(`/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`)}
            className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-[8px] hover:scale-[1.02] active:scale-[0.98] transition-all glow-accent"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
