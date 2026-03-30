import { InvoiceData } from './supabase';

interface EmailResult {
  success: boolean;
  error?: string;
  messageId?: string;
}

interface SendInvoiceEmailParams {
  to: string;
  cc?: string;
  invoiceData: InvoiceData;
  invoiceNumber: string;
  pdfBuffer: Buffer;
  fromEmail: string;
  fromName?: string;
}

/**
 * Send invoice email using Resend API
 * Resilient: Returns success=false instead of throwing on failure
 */
export async function sendInvoiceEmail(params: SendInvoiceEmailParams): Promise<EmailResult> {
  const {
    to,
    cc,
    invoiceData,
    invoiceNumber,
    pdfBuffer,
    fromEmail,
    fromName = invoiceData.from?.company || 'AI Invoice Generator',
  } = params;

  // Validate required fields
  if (!to) {
    return {
      success: false,
      error: 'Client email is required',
    };
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not configured');
    return {
      success: false,
      error: 'Email service not configured',
    };
  }

  try {
    // Generate email content
    const subject = `Invoice #${invoiceNumber}`;
    const htmlBody = generateInvoiceEmailTemplate({
      invoiceNumber,
      invoiceData,
      fromName,
      fromEmail,
    });

    // Convert PDF to base64
    const pdfBase64 = pdfBuffer.toString('base64');

    // Prepare email payload
    const emailPayload: any = {
      from: `${fromName} <${fromEmail}>`,
      to: [to],
      subject: subject,
      html: htmlBody,
      attachments: [
        {
          filename: `${invoiceNumber}.pdf`,
          content: pdfBase64,
        },
      ],
    };

    // Add CC if provided
    if (cc) {
      emailPayload.cc = [cc];
    }

    console.log('[Email] Sending email via Resend API...');
    console.log('[Email] To:', to);
    console.log('[Email] CC:', cc || 'none');
    console.log('[Email] Subject:', subject);

    // Send via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Email] Resend API error:', response.status, errorText);

      // Try to parse error details
      let errorMessage = `Failed to send email: ${response.status} ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          errorMessage = errorJson.message;
        }
      } catch (e) {
        // If not JSON, use the raw error text
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    const data = await response.json();
    console.log('[Email] ✅ Email sent successfully:', data);

    return {
      success: true,
      messageId: data.id,
    };
  } catch (error) {
    console.error('[Email] Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate professional HTML email template
 */
function generateInvoiceEmailTemplate(params: {
  invoiceNumber: string;
  invoiceData: InvoiceData;
  fromName: string;
  fromEmail: string;
}) {
  const { invoiceNumber, invoiceData, fromName, fromEmail } = params;
  const { customer, invoice, total, items } = invoiceData;
  const currency = invoice.currency || 'USD';

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(total);

  const dueDate = invoice.dueDate
    ? new Date(invoice.dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #${invoiceNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { border-bottom: 3px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #f59e0b; }
    .title { font-size: 28px; font-weight: bold; margin: 20px 0; }
    .section { margin-bottom: 25px; }
    .label { font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600; margin-bottom: 5px; }
    .value { font-size: 16px; color: #111; }
    .total-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; }
    .total-amount { font-size: 32px; font-weight: bold; color: #f59e0b; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
    .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .items-table th { text-align: left; padding: 12px; background: #f9fafb; font-size: 12px; text-transform: uppercase; color: #6b7280; }
    .items-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🤖 AI Invoice Generator</div>
    </div>

    <h1 class="title">Invoice #${invoiceNumber}</h1>

    <div class="section">
      <div class="label">Bill To</div>
      <div class="value">
        <strong>${escapeHtml(customer.name)}</strong><br>
        ${customer.company ? escapeHtml(customer.company) + '<br>' : ''}
        ${customer.address ? escapeHtml(customer.address).replace(/\n/g, '<br>') + '<br>' : ''}
        ${customer.email ? escapeHtml(customer.email) : ''}
      </div>
    </div>

    <div class="section">
      <div class="label">Issue Date</div>
      <div class="value">
        ${new Date(invoice.issueDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
    </div>

    ${dueDate ? `
    <div class="section">
      <div class="label">Due Date</div>
      <div class="value">${dueDate}</div>
    </div>
    ` : ''}

    ${invoice.paymentTerms ? `
    <div class="section">
      <div class="label">Payment Terms</div>
      <div class="value">${escapeHtml(invoice.paymentTerms)}</div>
    </div>
    ` : ''}

    <table class="items-table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: right;">Qty</th>
          <th style="text-align: right;">Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
        <tr>
          <td>${escapeHtml(item.description)}</td>
          <td style="text-align: right;">${item.quantity}</td>
          <td style="text-align: right;">
            ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency,
            }).format(item.unitPrice)}
          </td>
          <td style="text-align: right;">
            ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency,
            }).format(item.total)}
          </td>
        </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="total-box">
      <div class="label">Total Amount Due</div>
      <div class="total-amount">${formattedTotal}</div>
    </div>

    ${invoiceData.payment?.instructions ? `
    <div class="section">
      <div class="label">Payment Instructions</div>
      <div class="value" style="white-space: pre-wrap;">${escapeHtml(invoiceData.payment.instructions)}</div>
    </div>
    ` : ''}

    ${invoice.notes ? `
    <div class="section">
      <div class="label">Notes</div>
      <div class="value" style="white-space: pre-wrap;">${escapeHtml(invoice.notes)}</div>
    </div>
    ` : ''}

    <div class="footer">
      <p>If you have any questions, please contact:</p>
      <p><strong>${escapeHtml(fromName)}</strong><br>${escapeHtml(fromEmail)}</p>
      <br>
      <p style="font-size: 12px;">This invoice was generated by AI Invoice Generator</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
