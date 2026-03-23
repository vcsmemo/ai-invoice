import './globals.css'
import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import SessionProvider from '@/components/SessionProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import SchemaOrg from '@/components/SchemaOrg'

const mono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'AI Invoice Generator - Create Professional Invoices in 30 Seconds',
    template: '%s | AI Invoice Generator',
  },
  description: 'Create professional invoices in seconds with AI. Just describe your work and we\'ll generate a beautiful invoice with automatic calculations, PDF download, and more. Perfect for freelancers and small businesses.',
  keywords: [
    'ai invoice generator',
    'invoice maker',
    'create invoice online',
    'free invoice template',
    'freelance invoice',
    'professional invoice',
    'invoice pdf',
    'automatic invoice',
    'small business invoice',
    'consulting invoice',
    'invoice creator',
    'instant invoice',
    'professional templates',
  ],
  authors: [{ name: 'AI Invoice Generator' }],
  creator: 'AI Invoice Generator',
  publisher: 'AI Invoice Generator',

  // Open Graph / Facebook
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    title: 'AI Invoice Generator - Create Professional Invoices in 30 Seconds',
    description: 'Create professional invoices in seconds with AI. Just describe your work and we\'ll generate a beautiful invoice.',
    siteName: 'AI Invoice Generator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Invoice Generator',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'AI Invoice Generator - Create Professional Invoices in 30 Seconds',
    description: 'Create professional invoices in seconds with AI. Perfect for freelancers and small businesses.',
    images: ['/og-image.png'],
    creator: '@yourhandle',
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },

  // Manifest
  manifest: '/manifest.json',

  // Additional
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${mono.variable}`}>
      <head>
        <SchemaOrg />
      </head>
      <body className="font-mono bg-background text-foreground antialiased selection:bg-primary/30 selection:text-primary">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
          <div className="relative z-10">
            <SessionProvider>{children}</SessionProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
