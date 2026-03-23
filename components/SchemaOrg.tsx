import { Article, WithContext } from 'schema-dts'

export default function WebPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AI Invoice Generator',
    description: 'Create professional invoices in seconds with AI-powered automation',
    url: 'https://www.aiinvoicegenerators.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    featureList: [
      'AI-powered invoice generation',
      'Automatic PDF creation',
      'Multiple currency support',
      'Professional templates',
      'Instant download',
    ],
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
