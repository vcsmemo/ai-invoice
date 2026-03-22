'use client';

import Link from 'next/link';
import { FileText, LogOut, User, Settings } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-[rgba(10,10,10,0.8)] backdrop-blur-xl border-b border-[rgba(96,96,104,0.2)]">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-2 h-2 rounded-full bg-[rgb(217,145,120)] group-hover:animate-pulse" />
        <span className="font-bold text-[rgb(237,237,237)] text-sm tracking-tight">~/ai-invoice</span>
        <span className="w-1.5 h-4 bg-[rgb(217,145,120)] animate-blink" />
      </Link>

      <div className="flex items-center gap-6">
        <Link href="#how" className="text-xs font-bold text-[rgb(163,163,163)] hover:text-[rgb(217,145,120)] transition-colors uppercase tracking-widest">
          $ ls --how-it-works
        </Link>
        <Link href="/pricing" className="text-xs font-bold text-[rgb(163,163,163)] hover:text-[rgb(217,145,120)] transition-colors uppercase tracking-widest">
          $ cd /pricing
        </Link>

        {status === 'loading' ? (
          <div className="w-7 h-7 bg-[rgb(16,16,16)] rounded-full animate-pulse"></div>
        ) : session?.user ? (
          <div className="flex items-center gap-4">
            <Link href="/my-invoices" className="text-xs font-bold text-[rgb(163,163,163)] hover:text-[rgb(217,145,120)] transition-colors uppercase tracking-widest">
              My Invoices
            </Link>
            <Link href="/settings" className="text-xs font-bold text-[rgb(163,163,163)] hover:text-[rgb(217,145,120)] transition-colors flex items-center gap-1.5 uppercase tracking-widest">
              <Settings className="w-3 h-3" />
              Config
            </Link>
            <div className="flex items-center gap-3 border-l border-[rgba(96,96,104,0.2)] pl-4">
              <div className="flex items-center gap-2">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || ''}
                    className="w-6 h-6 rounded-full border border-[rgba(96,96,104,0.2)]"
                  />
                ) : (
                  <div className="w-6 h-6 bg-[rgb(17,17,17)] rounded-full flex items-center justify-center border border-[rgba(96,96,104,0.2)]">
                    <User className="w-3 h-3 text-[rgb(163,163,163)]" />
                  </div>
                )}
                <div className="text-[10px] leading-tight font-bold">
                  <p className="text-[rgb(237,237,237)] uppercase tracking-tighter">{session.user.name?.split(' ')[0]}</p>
                  <p className="text-[rgb(217,145,120)]">{session.user.credits_remaining}CR</p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-1 text-[rgb(163,163,163)] hover:text-[rgb(217,145,120)] transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <Link
            href="/api/auth/signin"
            className="px-4 py-2 bg-[rgb(217,145,120)] text-[rgb(10,10,10)] text-xs font-bold rounded-[8px] hover:scale-[1.02] active:scale-[0.98] transition-all glow-accent"
          >
            $ sudo login
          </Link>
        )}
      </div>
    </nav>
  );
}
