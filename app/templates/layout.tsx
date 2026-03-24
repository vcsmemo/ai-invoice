import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoice Templates - Country-Specific & Professional Styles',
  description: 'Browse our collection of professionally designed invoice templates for different countries and industries. US, UK, Canada, Australia, and more. Tax-compliant and ready to use.',
  keywords: [
    'invoice templates',
    'free invoice templates',
    'us invoice template',
    'uk invoice template vat',
    'canadian invoice template gst',
    'australian tax invoice',
    'professional invoice templates',
    'invoice template download',
    'blank invoice template',
    'consulting invoice template',
    'freelance invoice template',
    'service invoice template',
  ],
  openGraph: {
    title: 'Invoice Templates - Country-Specific & Professional Styles',
    description: 'Browse our collection of professionally designed invoice templates for different countries and industries.',
    url: '/templates',
  },
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
