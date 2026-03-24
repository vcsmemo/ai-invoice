import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: March 2025</p>
          </div>

          <div className="space-y-8 prose prose-lg max-w-none dark:prose-invert">
            <section>
              <h2>1. Information We Collect</h2>
              <p>
                AI Invoice Generator collects the following information to provide our service:
              </p>
              <ul>
                <li><strong>Account Information:</strong> Email address, name (via Google OAuth)</li>
                <li><strong>Profile Information:</strong> Company name, address, phone, website, tax ID (optional)</li>
                <li><strong>Invoice Data:</strong> Invoice details, customer information, line items, payment terms</li>
                <li><strong>Payment Information:</strong> Payment processing is handled by Stripe. We do not store your credit card information.</li>
              </ul>
            </section>

            <section>
              <h2>2. How We Use Your Information</h2>
              <p>
                We use your information solely to:
              </p>
              <ul>
                <li>Generate and manage your invoices</li>
                <li>Provide customer support</li>
                <li>Process payments via Stripe</li>
                <li>Improve our service</li>
                <li>Send you important service updates (rare)</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                <strong>Important:</strong> We never sell your data to third parties. Your invoice data is used only to provide the service.
              </p>
            </section>

            <section>
              <h2>3. Data Storage & Security</h2>
              <p>
                <strong>Storage Provider:</strong> We use Supabase (built on PostgreSQL) for secure data storage.
              </p>
              <p>
                <strong>Security Measures:</strong>
              </p>
              <ul>
                <li>All data is encrypted in transit (HTTPS/TLS)</li>
                <li>Authentication handled securely via NextAuth.js and Google OAuth</li>
                <li>Database access restricted and logged</li>
                <li>Regular security audits and updates</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                While we implement industry-standard security measures, no method of transmission or storage is completely secure.
              </p>
            </section>

            <section>
              <h2>4. Data Retention & Deletion</h2>
              <p>
                <strong>Your Rights:</strong> You have the right to access, modify, or delete your account and all associated data at any time through the Settings page.
              </p>
              <p>
                <strong>Upon Account Deletion:</strong> All your personal information, profile data, and invoice records will be permanently deleted within 30 days.
              </p>
              <p>
                <strong>Data Retention:</strong> We retain your data only as long as your account is active, or as required by law for tax and business record-keeping purposes.
              </p>
            </section>

            <section>
              <h2>5. AI and Third-Party Services</h2>
              <p>
                We use the following third-party services:
              </p>
              <ul>
                <li><strong>Anthropic Claude AI:</strong> For intelligent invoice generation. Your prompts are sent to Claude's API to generate invoice content. Anthropic does not use your data to train their models.</li>
                <li><strong>Stripe:</strong> For secure payment processing. See <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Stripe's Privacy Policy</a>.</li>
                <li><strong>Google:</strong> For authentication via Google OAuth. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google's Privacy Policy</a>.</li>
                <li><strong>Supabase:</strong> For database and file storage. See <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Supabase's Privacy Policy</a>.</li>
              </ul>
            </section>

            <section>
              <h2>6. Cookies & Tracking</h2>
              <p>
                <strong>Essential Cookies:</strong> We use essential cookies via NextAuth.js to maintain your secure session. These cannot be disabled.
              </p>
              <p>
                <strong>Analytics:</strong> We do not currently use tracking or analytics cookies.
              </p>
            </section>

            <section>
              <h2>7. GDPR Compliance (EU Users)</h2>
              <p>
                If you are located in the European Union, you have the following rights under GDPR:
              </p>
              <ul>
                <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Right to Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                To exercise these rights, please contact us at support@yourdomain.com or use the Settings page.
              </p>
            </section>

            <section>
              <h2>8. Children's Privacy</h2>
              <p>
                Our service is not intended for children under 13. We do not knowingly collect information from children under 13. If we become aware of such collection, we will take immediate steps to delete it.
              </p>
            </section>

            <section>
              <h2>9. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify users of significant changes via email or prominent site notice.
              </p>
            </section>

            <section>
              <h2>10. Contact Us</h2>
              <p>
                If you have questions, concerns, or requests regarding this privacy policy or your personal data, please contact us at:
              </p>
              <p>
                <strong>Email:</strong> support@yourdomain.com<br />
                Or use the contact form on our website.
              </p>
            </section>

            <section className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-0">
                <strong>Important:</strong> By using AI Invoice Generator, you acknowledge that you have read, understood, and agree to this Privacy Policy.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
