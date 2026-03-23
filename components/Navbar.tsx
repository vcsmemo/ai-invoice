'use client';

import Link from 'next/link';
import { FileText, LogOut, User, Settings } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-background/80 backdrop-blur-xl border-b border-border">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-2 h-2 rounded-full bg-primary group-hover:animate-pulse" />
        <span className="font-bold text-foreground text-sm tracking-tight">AI Invoice Generator</span>
        <span className="w-1.5 h-4 bg-primary animate-blink" />
      </Link>

      <div className="flex items-center gap-6">
        <Link href="#how" className="text-xs font-bold text-[rgb(163,163,163)] hover:text-[rgb(217,145,120)] transition-colors uppercase tracking-widest">
          $ ls --how-it-works
        </Link>
        <Link href="/templates" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
          $ cd /templates
        </Link>
        <Link href="/pricing" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
          $ cd /pricing
        </Link>

        {status === 'loading' ? (
          <div className="w-7 h-7 bg-muted rounded-full animate-pulse"></div>
        ) : session?.user ? (
          <div className="flex items-center gap-4">
            <Link href="/generate" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
              Generate
            </Link>
            <Link href="/my-invoices" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
              My Invoices
            </Link>
            <Link href="/settings" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 uppercase tracking-widest">
              <Settings className="w-3 h-3" />
              Config
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
          <Link
            href="/api/auth/signin"
            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-[8px] hover:scale-[1.02] active:scale-[0.98] transition-all glow-accent"
          >
            $ sudo login
          </Link>
        )}
      </div>
    </nav>
  );
}
