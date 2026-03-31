import { WithContext } from 'schema-dts'

export default function SchemaOrg() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AI Invoice Generator',
    description: 'Create professional invoices in 30 seconds with AI. Just describe your work and AI generates a complete invoice with automatic calculations, PDF download, and email delivery.',
    url: 'https://aiinvoicegenerators.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '3,254',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'AI-powered invoice generation',
      'Natural language input',
      'Automatic PDF creation',
      'Multiple currency support (USD, EUR, GBP, AUD, CAD, etc.)',
      'Professional invoice templates',
      'Instant PDF download',
      'Email delivery to clients',
      'Auto-save and cloud storage',
      'Mobile-friendly design',
      'No account required for free tier',
    ],
    provider: {
      '@type': 'Organization',
      name: 'AI Invoice Generator',
      url: 'https://aiinvoicegenerators.com',
    },
  } as WithContext<any>

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  )
}
