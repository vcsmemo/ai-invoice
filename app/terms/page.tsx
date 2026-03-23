export default function TermsPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="prose prose-lg max-w-none">
          <p>Last updated: March 2024</p>

          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using AI Invoice Generator, you accept and agree to be bound by these Terms of Service.
          </p>

          <h2>Description of Service</h2>
          <p>
            AI Invoice Generator is an AI-powered tool that allows users to create professional invoices using natural language. We operate on a credit-based model.
          </p>

          <h2>User Responsibilities</h2>
          <p>
            You are responsible for the accuracy of the information in your invoices and for maintaining the security of your account.
          </p>

          <h2>Credits and Pricing</h2>
          <p>
            New users receive 5 complimentary credits. Additional credits can be purchased in packs. One credit is consumed for each unique invoice generated and saved. All purchases are final.
          </p>

          <h2>Payment Terms</h2>
          <p>
            Payment is handled securely via Stripe. We do not store your credit card information.
          </p>

          <h2>Changes to Service</h2>
          <p>
            We reserve the right to modify or discontinue the service at any time.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about these Terms of Service, please contact us at support@invoicegenerator.ai
          </p>
        </div>
      </div>
    </div>
  )
}
