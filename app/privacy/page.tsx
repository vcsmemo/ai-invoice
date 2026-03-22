export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none">
          <p>Last updated: March 2024</p>

          <h2>Information We Collect</h2>
          <p>
            InvoiceAI collects minimal information necessary to provide our service. We do not store your invoice data on our servers - all information is processed locally in your browser.
          </p>

          <h2>How We Use Your Information</h2>
          <p>
            We use the information you provide solely to generate invoices. Your data is never sold, rented, or shared with third parties for marketing purposes.
          </p>

          <h2>Data Storage</h2>
          <p>
            Invoice templates and client information are stored locally in your browser's local storage. We do not have access to this data and it is never transmitted to our servers.
          </p>

          <h2>Cookies</h2>
          <p>
            We use essential cookies to ensure the website functions properly. These include cookies for maintaining your session and storing your preferences.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            We use third-party services for payment processing (Stripe) and analytics. These services have their own privacy policies which we encourage you to review.
          </p>

          <h2>Your Rights</h2>
          <p>
            You have the right to access, modify, or delete your data at any time. Since your data is stored locally in your browser, you can clear it by clearing your browser's local storage.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us at privacy@invoiceai.com
          </p>
        </div>
      </div>
    </div>
  )
}
