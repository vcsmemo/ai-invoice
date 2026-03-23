import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', slug: 'us-invoice-template' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', slug: 'uk-invoice-template' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', slug: 'australian-tax-invoice-template' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', slug: 'canadian-invoice-template' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', slug: 'german-invoice-template' },
]

export default function TemplatesPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Invoice Templates for Every Country
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional invoice templates compliant with local tax regulations. Select your country to generate your invoice in seconds.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {countries.map((country) => (
            <Link
              key={country.code}
              href={`/generate?country=${country.code}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 border border-gray-200 hover:border-primary-500"
            >
              <div className="text-5xl mb-4">{country.flag}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition">
                {country.name} Invoice Template
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Generate professional invoices compliant with {country.name} tax regulations
              </p>
              <div className="flex items-center text-primary-600 font-medium text-sm">
                Generate Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </div>
            </Link>
          ))}
        </div>

        {/* More Countries */}
        <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            45+ More Countries Available
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We support invoice templates for countries around the world. From France to Japan, Brazil to India - we've got you covered.
          </p>
          <Link
            href="/"
            className="btn-primary inline-flex"
          >
            Start Generating
          </Link>
        </div>

        {/* SEO Content */}
        <div className="mt-20 prose prose-lg max-w-none">
          <h2>Why Use Our Invoice Templates?</h2>
          <p>
            Our invoice templates are designed to help freelancers, contractors, and small businesses create professional invoices in seconds. Each template is compliant with local tax regulations and includes all necessary fields.
          </p>

          <h3>Features Include:</h3>
          <ul>
            <li><strong>Auto-generated invoice numbers</strong> - Never worry about duplicate invoice numbers again</li>
            <li><strong>Tax calculations</strong> - Automatic tax calculations based on local rates</li>
            <li><strong>Professional design</strong> - Clean, modern templates that impress clients</li>
            <li><strong>PDF export</strong> - Download your invoice as a professional PDF file</li>
            <li><strong>Multi-currency support</strong> - Supports all major currencies</li>
          </ul>

          <h3>How to Use Our Invoice Templates</h3>
          <ol>
            <li>Select your country from the list above</li>
            <li>Fill in your details and your client's information</li>
            <li>Add line items for your products or services</li>
            <li>Review and download your professional PDF invoice</li>
          </ol>

          <h2>Popular Invoice Templates</h2>
          <p>
            Our most popular templates include the US invoice template, UK invoice template, and Australian tax invoice template. These are designed to meet the specific requirements of each country's tax authority.
          </p>
        </div>
      </div>
    </div>
  )
}
