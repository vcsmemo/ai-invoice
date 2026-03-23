export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none">
          <p>Last updated: March 2024</p>

          <h2>Information We Collect</h2>
          <p>
            AI Invoice Generator collects your email address and profile information (company name, address, etc.) to provide our service. Your invoice data is stored securely in our database to allow you to manage and access your history.
          </p>

          <h2>How We Use Your Information</h2>
          <p>
            We use the information you provide solely to generate and manage invoices. Your data is encrypted and never shared with third parties for marketing purposes.
          </p>

          <h2>Data Storage & Security</h2>
          <p>
            Your profile and invoice data are stored securely using Supabase (PostgreSQL). We implement industry-standard security measures to protect your information. Logo files are stored in Supabase Storage.
          </p>

          <h2>Cookies</h2>
          <p>
            We use essential cookies via NextAuth.js to maintain your secure session. Authentication is handled safely through Google.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            We use Anthropic (Claude AI) for invoice generation and Stripe for secure payment processing. These services have their own privacy policies.
          </p>

          <h2>Your Rights</h2>
          <p>
            You have the right to access, modify, or delete your account and data at any time via the Settings page.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us at support@invoicegenerator.ai
          </p>
        </div>
      </div>
    </div>
  )
}
