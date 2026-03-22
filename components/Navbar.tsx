'use client';

import Link from 'next/link';
import { FileText, LogOut, User, Settings } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-[rgba(8,8,8,0.8)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[rgb(200,245,66)]" />
        <span className="font-semibold text-[rgb(250,250,250)] text-sm">AI Invoice Generators</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link href="#how" className="text-sm text-[rgb(180,180,180)] hover:text-[rgb(250,250,250)] transition-colors">
          How it works
        </Link>
        <Link href="/pricing" className="text-sm text-[rgb(180,180,180)] hover:text-[rgb(250,250,250)] transition-colors">
          Pricing
        </Link>

        {status === 'loading' ? (
          <div className="w-7 h-7 bg-[rgb(16,16,16)] rounded-full animate-pulse"></div>
        ) : session?.user ? (
          <div className="flex items-center gap-4">
            <Link href="/my-invoices" className="text-sm text-[rgb(180,180,180)] hover:text-[rgb(250,250,250)] transition-colors">
              My Invoices
            </Link>
            <Link href="/settings" className="text-sm text-[rgb(180,180,180)] hover:text-[rgb(250,250,250)] transition-colors flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              Settings
            </Link>
            <div className="flex items-center gap-2.5 border-l border-[rgba(255,255,255,0.08)] pl-4">
              <div className="flex items-center gap-2">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || ''}
                    className="w-7 h-7 rounded-full"
                  />
                ) : (
                  <div className="w-7 h-7 bg-[rgb(16,16,16)] rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.08)]">
                    <User className="w-3.5 h-3.5 text-[rgb(180,180,180)]" />
                  </div>
                )}
                <div className="text-sm leading-tight">
                  <p className="font-medium text-[rgb(250,250,250)] text-xs">{session.user.name}</p>
                  <p className="text-[10px] text-[rgb(180,180,180)]">{session.user.credits_remaining} credits</p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-1.5 text-[rgb(180,180,180)] hover:text-[rgb(250,250,250)] transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <Link
            href="/api/auth/signin"
            className="px-4 py-2 bg-[rgb(200,245,66)] text-[rgb(8,8,8)] text-sm font-semibold rounded-full hover:scale-[1.02] transition-all glow-accent"
          >
            Get started free
          </Link>
        )}
      </div>
    </nav>
  );
}
