import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Online Invoice Maker - Create Professional Invoices Fast | InvoiceAI',
  description: 'Fast online invoice maker. Create, customize, and download professional invoices in 30 seconds. Free invoice templates for 50+ countries. Start now!',
  keywords: 'invoice maker, online invoice maker, create invoice online, invoice creator, invoice builder',
  openGraph: {
    title: 'Online Invoice Maker - Create Professional Invoices Fast',
    description: 'Create professional invoices in 30 seconds with our online invoice maker. Free to use.',
    type: 'website',
  },
}

export default function InvoiceMakerPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Online Invoice Maker
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create professional invoices in 30 seconds. The fastest way to get paid.
          </p>
          <Link
            href="/"
            className="btn-primary text-lg px-8 py-4 inline-block"
          >
            Make Your Invoice Now
          </Link>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>The Fastest Online Invoice Maker</h2>
          <p>
            Our online invoice maker is designed for speed and simplicity. Create professional invoices in under 30 seconds with our intuitive interface. Perfect for busy freelancers and small business owners.
          </p>

          <h3>Why Choose Our Invoice Maker?</h3>
          <ul>
            <li><strong>Lightning Fast</strong> - Create invoices in 30 seconds or less</li>
            <li><strong>Easy to Use</strong> - No accounting knowledge required</li>
            <li><strong>Professional</strong> - Clean, modern design that impresses clients</li>
            <li><strong>Smart Features</strong> - Auto-fill, calculations, and more</li>
            <li><strong>50+ Countries</strong> - Correct tax formats for your country</li>
            <li><strong>Instant PDF</strong> - Download ready-to-send invoices immediately</li>
          </ul>

          <h2>How to Use the Invoice Maker</h2>
          <ol>
            <li><strong>Select Country</strong> - Choose your country for correct tax format</li>
            <li><strong>Fill Details</strong> - Enter your and your client's information</li>
            <li><strong>Add Items</strong> - List your products or services</li>
            <li><strong>Review</strong> - Check the automatic calculations</li>
            <li><strong>Download</strong> - Get your professional PDF invoice instantly</li>
          </ol>

          <h2>Features That Save You Time</h2>
          <h3>Smart Auto-Fill</h3>
          <p>
            Our invoice maker intelligently fills in details like invoice numbers, dates, and payment terms. You can also save your details as templates for even faster invoicing (Pro feature).
          </p>

          <h3>Automatic Calculations</h3>
          <p>
            Never worry about math errors again. Our invoice maker automatically calculates:
          </p>
          <ul>
            <li>Line item totals (quantity × rate)</li>
            <li>Subtotal</li>
            <li>Tax/VAT/GST based on your country</li>
            <li>Grand total</li>
          </ul>

          <h3>Professional Design</h3>
          <p>
            Every invoice looks professional and polished. Clean layout, proper formatting, and attention to detail that shows your clients you mean business.
          </p>

          <h2>Perfect For Every Business Type</h2>
          <ul>
            <li><strong>Freelancers</strong> - Designers, developers, writers, consultants</li>
            <li><strong>Contractors</strong> - Construction, IT, maintenance</li>
            <li><strong>Service Providers</strong> - Cleaning, landscaping, catering</li>
            <li><strong>Creatives</strong> - Photographers, videographers, artists</li>
            <li><strong>Consultants</strong> - Business, marketing, financial advisors</li>
            <li><strong>Small Businesses</strong> - Retail, e-commerce, local services</li>
          </ul>

          <h2>Invoice Maker vs Traditional Methods</h2>
          <p>
            Why use an online invoice maker instead of Word, Excel, or accounting software?
          </p>
          <ul>
            <li><strong>Faster than Word/Excel</strong> - No manual calculations or formatting</li>
            <li><strong>Professional design</strong> - Better than DIY templates</li>
            <li><strong>Easier than accounting software</strong> - No learning curve</li>
            <li><strong>Country-specific</strong> - Correct tax formats for your location</li>
            <li><strong>Accessible anywhere</strong> - Works on any device with a browser</li>
          </ul>

          <h2>Advanced Features (Pro)</h2>
          <p>
            Upgrade to Pro for even more powerful features:
          </p>
          <ul>
            <li>Save client and template information</li>
            <li>Generate unlimited invoices</li>
            <li>Remove watermarks</li>
            <li>Add your company logo</li>
            <li>Batch invoice generation</li>
            <li>Email invoices directly</li>
          </ul>

          <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-8 rounded-xl my-8">
            <p className="text-2xl font-bold mb-4">
              Start Getting Paid Faster
            </p>
            <p className="mb-6">
              Join 10,000+ freelancers who use our invoice maker to get paid faster and more professionally.
            </p>
            <Link
              href="/"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
            >
              Create Your First Invoice
            </Link>
          </div>

          <h2>Common Invoice Maker Questions</h2>

          <h3>How long does it take to make an invoice?</h3>
          <p>
            Most users complete their first invoice in under 30 seconds. Once you've used it a few times, you can create invoices in 15 seconds or less.
          </p>

          <h3>Do I need to download anything?</h3>
          <p>
            No! Our invoice maker works entirely in your browser. No software to download, no updates to install.
          </p>

          <h3>Can I save my invoices?</h3>
          <p>
            All invoices are downloaded as PDF files to your device. Pro users can also save templates and client information for faster future invoicing.
          </p>

          <h3>Is my data secure?</h3>
          <p>
            Absolutely. Your invoice data is processed locally in your browser. We don't store your invoice information on our servers.
          </p>

          <h3>Can I customize the invoice?</h3>
          <p>
            Yes! You can add your logo, choose colors, and customize the layout. Pro users have even more customization options.
          </p>
        </div>
      </div>
    </div>
  )
}
