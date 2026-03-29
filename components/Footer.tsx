import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">AI</span>
                </div>
                <span className="font-bold text-base">
                  <span className="text-primary">AI</span> Invoice Generator
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create professional invoices in seconds with AI. Perfect for freelancers and small businesses.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Invoice Generator
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/templates" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Invoice Templates
                </Link>
              </li>
              <li>
                <Link href="/my-invoices" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  My Invoices
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} AI Invoice Generator. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="mailto:contact@aiinvoicegenerators.com"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              contact@aiinvoicegenerators.com
            </a>
            <span className="text-sm text-muted-foreground">
              Made with ❤️ for freelancers worldwide
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
