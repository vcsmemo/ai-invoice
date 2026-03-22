import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Free Invoice Generator - Create Unlimited Invoices Online | InvoiceAI',
  description: 'Generate professional invoices for free. No signup required. Download PDF invoices in seconds. Perfect for freelancers and small businesses. Start creating invoices now!',
  keywords: 'free invoice generator, free invoice template, online invoice maker, create invoice free, invoice generator free',
  openGraph: {
    title: 'Free Invoice Generator - Create Professional Invoices in Seconds',
    description: 'Generate unlimited professional invoices for free. No signup required. Download as PDF.',
    type: 'website',
  },
}

export default function FreeInvoiceGeneratorPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Free Invoice Generator
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create professional invoices for free. No signup, no credit card required.
          </p>
          <Link
            href="/"
            className="btn-primary text-lg px-8 py-4 inline-block"
          >
            Start Generating Invoices
          </Link>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>Why Use Our Free Invoice Generator?</h2>
          <p>
            Our free invoice generator helps freelancers, contractors, and small businesses create professional invoices in seconds. No need to signup or provide credit card information - just start creating invoices immediately.
          </p>

          <h3>Key Features:</h3>
          <ul>
            <li><strong>100% Free</strong> - Generate up to 3 invoices per month at no cost</li>
            <li><strong>No Signup Required</strong> - Start creating invoices instantly</li>
            <li><strong>Professional PDF</strong> - Download clean, professional PDF invoices</li>
            <li><strong>50+ Countries</strong> - Templates for over 50 countries with correct tax formats</li>
            <li><strong>Auto Calculations</strong> - Automatic subtotal, tax, and total calculations</li>
            <li><strong>Instant Download</strong> - Get your invoice PDF in seconds</li>
          </ul>

          <h2>How to Create a Free Invoice</h2>
          <ol>
            <li>Select your country from our list of 50+ supported countries</li>
            <li>Fill in your business details and your client's information</li>
            <li>Add your line items (products or services)</li>
            <li>Review the automatic calculations</li>
            <li>Download your professional PDF invoice instantly</li>
          </ol>

          <h2>Free vs Pro Plan</h2>
          <p>
            While our free plan is perfect for occasional use, freelancers who generate invoices regularly may benefit from upgrading to Pro. The Pro plan offers unlimited invoices, no watermarks, template saving, and more advanced features.
          </p>

          <h2>What Can You Do with Free Invoices?</h2>
          <p>
            Our free invoices are fully professional and suitable for business use. They include:
          </p>
          <ul>
            <li>Professional layout and design</li>
            <li>Your business and client information</li>
            <li>Line items with quantity and rate</li>
            <li>Automatic tax calculations</li>
            <li>Totals and payment terms</li>
          </ul>

          <h2>Perfect For:</h2>
          <ul>
            <li><strong>Freelancers</strong> - Bill clients for your work</li>
            <li><strong>Contractors</strong> - Send professional invoices for your services</li>
            <li><strong>Small Businesses</strong> - Create invoices without expensive software</li>
            <li><strong>Consultants</strong> - Professional invoicing for your consulting work</li>
            <li><strong>Gig Workers</strong> - Get paid for your gig economy work</li>
          </ul>

          <div className="bg-primary-50 border-l-4 border-primary-600 p-6 my-8">
            <p className="text-lg font-semibold text-gray-900 mb-2">
              Ready to create your first invoice?
            </p>
            <p className="text-gray-700 mb-4">
              Start generating professional invoices in seconds. No signup required.
            </p>
            <Link
              href="/"
              className="btn-primary inline-block"
            >
              Generate Free Invoice Now
            </Link>
          </div>

          <h2>Frequently Asked Questions</h2>

          <h3>Is this really free?</h3>
          <p>
            Yes! You can generate up to 3 invoices per month absolutely free. No credit card required, no hidden fees.
          </p>

          <h3>Do I need to create an account?</h3>
          <p>
            No account is required for the free plan. Just start generating invoices immediately.
          </p>

          <h3>Can I use these invoices for my business?</h3>
          <p>
            Absolutely! Our invoices are professional and suitable for business use in all supported countries.
          </p>

          <h3>What's the difference between free and pro?</h3>
          <p>
            The free plan includes 3 invoices per month with a small watermark. Pro offers unlimited invoices, no watermarks, template saving, and more features.
          </p>

          <h3>Can I upgrade later?</h3>
          <p>
            Yes! You can upgrade to Pro anytime if you need more invoices or advanced features.
          </p>
        </div>
      </div>
    </div>
  )
}
