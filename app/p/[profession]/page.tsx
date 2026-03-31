import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { professions } from '@/lib/professions-data'

interface PageProps {
  params: {
    profession: string
  }
}

export async function generateStaticParams() {
  return Object.keys(professions).map((profession) => ({
    profession,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const profession = professions[params.profession]

  if (!profession) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: profession.title,
    description: profession.metaDescription,
    openGraph: {
      title: profession.title,
      description: profession.metaDescription,
      type: 'website',
      url: `https://aiinvoicegenerators.com/p/${profession.slug}`,
      siteName: 'AI Invoice Generator',
    },
    twitter: {
      card: 'summary_large_image',
      title: profession.title,
      description: profession.metaDescription,
    },
    alternates: {
      canonical: `https://aiinvoicegenerators.com/p/${profession.slug}`,
    },
  }
}

export default function ProfessionPage({ params }: PageProps) {
  const profession = professions[params.profession]

  if (!profession) {
    notFound()
  }

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: profession.title,
            description: profession.metaDescription,
            url: `https://aiinvoicegenerators.com/p/${profession.slug}`,
            mainEntity: {
              '@type': 'FAQPage',
              mainEntity: profession.faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            },
            about: {
              '@type': 'SoftwareApplication',
              name: 'AI Invoice Generator',
              applicationCategory: 'BusinessApplication',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            },
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              {profession.h1}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {profession.description}
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {profession.valueProp}
            </p>
            <Link
              href="/?ref=profession-page"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105"
            >
              Generate Your Invoice Now
            </Link>
          </div>
        </section>

        {/* Examples Section */}
        <section className="container mx-auto px-4 py-12 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Just Describe Your Work - AI Handles the Rest
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Here are real examples of prompts you can use:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {profession.examples.map((example, index) => (
                <div
                  key={index}
                  className="bg-background rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-sm font-mono text-foreground/90 leading-relaxed">
                    &quot;{example}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">
              What You Can Invoice
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Common items {profession.slug}s include in their invoices:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profession.commonItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 bg-muted/30 rounded-lg p-4"
                >
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rate Range Section */}
        <section className="container mx-auto px-4 py-12 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Typical Rates for {profession.slug}s</h2>
            <p className="text-xl text-primary font-semibold">{profession.rateRange}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Rates vary based on experience, location, and project complexity
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {profession.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-muted/30 rounded-lg p-6 border border-border/50"
                >
                  <h3 className="text-lg font-semibold mb-3 text-foreground">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 bg-primary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Create Professional Invoices?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of {profession.slug}s who trust our AI invoice generator
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/?ref=profession-page"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105"
              >
                Start Generating Invoices
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg bg-background px-8 py-3 text-base font-semibold text-foreground border shadow-sm hover:bg-muted transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Related Professions */}
        {profession.relatedProfessions.length > 0 && (
          <section className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold mb-6 text-center">
                Related Invoice Generators
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {profession.relatedProfessions.map((related) => {
                  const relatedProfession = professions[related]
                  if (!relatedProfession) return null
                  return (
                    <Link
                      key={related}
                      href={`/p/${relatedProfession.slug}`}
                      className="inline-flex items-center rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/70 transition-colors"
                    >
                      {relatedProfession.title}
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
