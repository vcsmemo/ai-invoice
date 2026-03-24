import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: March 2025</p>
          </div>

          <div className="space-y-8 prose prose-lg max-w-none dark:prose-invert">
            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using AI Invoice Generator, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our service.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Age Requirement:</strong> You must be at least 13 years old to use this service. By using our service, you represent that you meet this age requirement.
              </p>
            </section>

            <section>
              <h2>2. Description of Service</h2>
              <p>
                AI Invoice Generator is an AI-powered tool that allows users to create professional invoices using natural language. Our service operates on a credit-based model, where each invoice generated and saved consumes one credit.
              </p>
              <p>
                <strong>Service Features:</strong>
              </p>
              <ul>
                <li>AI-powered invoice generation from natural language descriptions</li>
                <li>Customizable invoice templates</li>
                <li>PDF export functionality</li>
                <li>Invoice history and management</li>
                <li>Company profile management</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                We reserve the right to modify, suspend, or discontinue the service (or any part of it) at any time with or without notice.
              </p>
            </section>

            <section>
              <h2>3. User Responsibilities & Obligations</h2>
              <p>
                <strong>Accuracy of Information:</strong> You are solely responsible for the accuracy, completeness, and legality of all information you enter into invoices. This includes but is not limited to:
              </p>
              <ul>
                <li>Invoice amounts and calculations</li>
                <li>Customer information</li>
                <li>Tax calculations and compliance</li>
                <li>Business details and contact information</li>
              </ul>
              <p>
                <strong>Verification Required:</strong> AI-generated content may contain errors or inaccuracies. You must carefully review all generated invoices before sending them to customers.
              </p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm mb-0">
                  <strong>Disclaimer:</strong> AI Invoice Generator provides a tool to assist in invoice creation, but we cannot guarantee the accuracy, completeness, or suitability of the generated content. You assume full responsibility for use of the invoices.
                </p>
              </div>
            </section>

            <section>
              <h2>4. AI Generation & Accuracy Disclaimer</h2>
              <p>
                <strong>AI Limitations:</strong> Our service uses artificial intelligence to generate invoice content. While we strive for accuracy, AI may:
              </p>
              <ul>
                <li>Misunderstand complex descriptions</li>
                <li>Make calculation errors</li>
                <li>Omit important details</li>
                <li>Generate content that requires verification</li>
              </ul>
              <p>
                <strong>Your Responsibility:</strong> You must:
              </p>
              <ul>
                <li>Carefully review all AI-generated invoices</li>
                <li>Verify all calculations, especially for complex invoices</li>
                <li>Ensure tax compliance in your jurisdiction</li>
                <li>Validate that all required information is included</li>
                <li>Make necessary corrections before sending to customers</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                <strong>No Warranty:</strong> THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </section>

            <section>
              <h2>5. Credits, Pricing & Payment</h2>
              <p>
                <strong>Credit System:</strong>
              </p>
              <ul>
                <li>New users receive 5 free credits to try the service</li>
                <li>Additional credits can be purchased in packages (10, 50, or 100 credits)</li>
                <li>One credit is consumed when an invoice is generated and saved</li>
                <li>Re-downloading existing invoices does not consume additional credits</li>
                <li>Credits do not expire</li>
              </ul>
              <p>
                <strong>Payment Terms:</strong>
              </p>
              <ul>
                <li>Payment is processed securely through Stripe</li>
                <li>We do not store your credit card information</li>
                <li>All sales are final - no refunds except as required by law</li>
                <li>Prices are subject to change with notice</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                <strong>Refund Policy:</strong> Due to the digital nature of the service, credits cannot be refunded once purchased. Exceptions may be made in cases of technical failure on our end.
              </p>
            </section>

            <section>
              <h2>6. Prohibited Activities</h2>
              <p>
                You agree not to use the service to:
              </p>
              <ul>
                <li>Create fraudulent or fake invoices</li>
                <li>Misrepresent goods or services</li>
                <li>Violate any laws or regulations (tax, financial, or otherwise)</li>
                <li>Infringe on the rights of others</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the service for any illegal purpose</li>
                <li>Reverse-engineer or attempt to extract our AI models</li>
              </ul>
              <p>
                <strong>Consequences:</strong> We reserve the right to suspend or terminate accounts that violate these terms, with or without notice and without liability.
              </p>
            </section>

            <section>
              <h2>7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law:
              </p>
              <ul>
                <li>We are not liable for any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Our total liability shall not exceed the amount you paid for credits in the past 12 months</li>
                <li>We are not responsible for business losses, lost revenue, or damages arising from your use of invoices</li>
                <li>We are not liable for errors or inaccuracies in AI-generated content</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Some jurisdictions do not allow the exclusion of certain warranties or the limitation of liability, so the above limitations may not apply to you.
              </p>
            </section>

            <section>
              <h2>8. Intellectual Property</h2>
              <p>
                <strong>Our Content:</strong> The service, including its design, text, graphics, and code, is owned by AI Invoice Generator and protected by intellectual property laws.
              </p>
              <p>
                <strong>Your Content:</strong> You retain ownership of the invoice data you create. However, you grant us a license to store, process, and display your data solely to provide the service.
              </p>
              <p>
                <strong>Feedback:</strong> If you provide feedback or suggestions, you grant us the right to use that feedback without obligation to compensate you.
              </p>
            </section>

            <section>
              <h2>9. Account Security & Termination</h2>
              <p>
                <strong>Your Responsibilities:</strong>
              </p>
              <ul>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Notify us immediately of unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
              <p>
                <strong>Termination:</strong> We may suspend or terminate your account at any time, with or without cause, with or without notice.
              </p>
              <p>
                Upon termination, your right to use the service ceases immediately.
              </p>
            </section>

            <section>
              <h2>10. Dispute Resolution</h2>
              <p>
                Any disputes arising from these terms shall be governed by the laws of the jurisdiction in which our business is established.
              </p>
              <p>
                We encourage users to contact us first at support@yourdomain.com to resolve any issues amicably.
              </p>
            </section>

            <section>
              <h2>11. Changes to Terms</h2>
              <p>
                We may modify these terms at any time. We will notify users of significant changes via:
              </p>
              <ul>
                <li>Email (if you have an account)</li>
                <li>Notice on our website</li>
                <li>In-app notification</li>
              </ul>
              <p>
                Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2>12. Severability</h2>
              <p>
                If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
              </p>
            </section>

            <section>
              <h2>13. Waiver</h2>
              <p>
                Our failure to enforce any right or provision of these terms does not constitute a waiver of such right or provision.
              </p>
            </section>

            <section>
              <h2>14. Contact Information</h2>
              <p>
                If you have questions about these Terms of Service, please contact us:
              </p>
              <p>
                <strong>Email:</strong> support@yourdomain.com<br />
                <strong>Website:</strong> Through the contact form on our website
              </p>
              <p className="text-sm text-muted-foreground">
                We will respond to legitimate inquiries within a reasonable timeframe.
              </p>
            </section>

            <section className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <p className="text-sm mb-0">
                <strong>Important:</strong> By using AI Invoice Generator, you acknowledge that you have read these Terms of Service, understand them, and agree to be bound by them. If you do not agree, please discontinue use of the service immediately.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
