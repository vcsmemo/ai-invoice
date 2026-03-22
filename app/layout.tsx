import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SessionProvider from '@/components/SessionProvider'
import SchemaOrg from '@/components/SchemaOrg'

const inter = Inter({ subsets: ['latin'] })

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

  // Verification (add your keys)
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <SchemaOrg />
      </head>
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
