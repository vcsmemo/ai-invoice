import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
let anthropicInstance: Anthropic | null = null;

export function getAnthropic() {
  if (!anthropicInstance) {
    const baseURL = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
    console.log('[Anthropic] Initializing with:', {
      baseURL,
      hasApiKey: !!process.env.ANTHROPIC_API_KEY,
      apiKeyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 10) + '...',
    });

    anthropicInstance = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      baseURL: baseURL,
    });

    console.log('[Anthropic] Client created successfully');
  }
  return anthropicInstance;
}

export interface InvoiceData {
  from?: {
    name: string;
    email?: string;
    company?: string;
    address?: string;
    phone?: string;
    website?: string;
    taxId?: string;
    logo?: string;
  };
  customer: {
    name: string;
    email?: string;
    company?: string;
    address?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total?: number;
    sku?: string;
  }>;
  invoice: {
    invoiceNumber: string;
    poNumber?: string;
    issueDate: string;
    dueDate?: string;
    currency: string;
    notes?: string;
    paymentTerms?: string;
  };
  payment?: {
    method?: string;
    bankAccount?: string;
    paypalEmail?: string;
    instructions?: string;
  };
  tax?: {
    rate: number;
    amount: number;
    description?: string;
  };
  discount?: {
    amount: number;
    percent?: number;
    description?: string;
  };
  subtotal: number;
  total: number;
  missingFields?: string[];
  suggestions?: {
    taxRate?: number;
    paymentTerms?: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Generate invoice from user conversation using Claude
 */
export async function generateInvoiceFromChat(
  messages: ChatMessage[],
  userContext?: {
    currency?: string;
    country?: string;
    companyName?: string;
    profile?: any; // User's profile with company info
  }
): Promise<InvoiceData> {
  try {
    const systemPrompt = `You are an expert invoice generation assistant. Your task is to extract invoice information from user conversations and generate structured invoice data.

CONTEXT:
- User's default currency: ${userContext?.currency || 'USD'}
- User's country: ${userContext?.country || 'US'}
- User's company: ${userContext?.companyName || 'Not specified'}
- User's profile: ${JSON.stringify(userContext?.profile || {})}

TASK:
1. Extract all relevant invoice information from the conversation
2. Ask for missing critical information if needed
3. Suggest reasonable defaults where appropriate
4. Calculate totals correctly

REQUIRED OUTPUT FORMAT (JSON only):
{
  "from": {
    "name": "string (user's name from profile)",
    "email": "string (user's email from profile)",
    "company": "string (company name from profile)",
    "address": "string (address from profile)",
    "phone": "string (phone from profile)",
    "website": "string (website from profile)",
    "taxId": "string (tax ID from profile)",
    "logo": "string (logo URL from profile)"
  },
  "customer": {
    "name": "string (required - customer's name)",
    "email": "string (optional - customer's email)",
    "company": "string (optional - customer's company)",
    "address": "string (optional - customer's address)"
  },
  "invoice": {
    "invoiceNumber": "string (auto-generated)",
    "poNumber": "string (optional - purchase order number if mentioned)",
    "issueDate": "YYYY-MM-DD (use today's date)",
    "dueDate": "YYYY-MM-DD (calculate based on payment terms)",
    "currency": "USD (or user's default)",
    "paymentTerms": "string (default: 'Net 30')",
    "notes": "string (optional - any notes or thank you message)"
  },
  "items": [
    {
      "description": "string (required)",
      "quantity": "number (required, default 1)",
      "unitPrice": "number (required)",
      "total": "number (quantity × unitPrice)",
      "sku": "string (optional)"
    }
  ],
  "payment": {
    "method": "string (optional)",
    "bankAccount": "string (optional - from profile)",
    "paypalEmail": "string (optional)",
    "instructions": "string (from profile payment instructions)"
  },
  "tax": {
    "rate": "number (from profile default or 0)",
    "amount": "number (calculated)",
    "description": "string (optional, e.g., 'Sales Tax')"
  },
  "discount": {
    "amount": "number (optional)",
    "percent": "number (optional)",
    "description": "string (optional)"
  },
  "subtotal": "number (calculated)",
  "total": "number (calculated)",
  "missingFields": ["array of critical missing fields"],
  "suggestions": {
    "taxRate": "number",
    "paymentTerms": "string"
  }
}

TAX RULES:
- US: Services typically 0% tax (unless specified)
- Use user's default tax rate from profile
- Calculate tax AFTER discount if both exist

CALCULATION RULES:
- subtotal = sum of all (quantity × unitPrice)
- discount = subtotal × discountPercent OR discountAmount
- taxableAmount = subtotal - discount
- taxAmount = taxableAmount × taxRate
- total = taxableAmount + taxAmount

IMPORTANT:
- Extract PO number if mentioned
- Note any payment terms mentioned
- Include company information from profile in "from" field
- If user mentions specific payment method, include it

Return ONLY the JSON, no additional text. Ensure all numbers are valid numbers, not strings.`;

    // Using claude-3-5-sonnet-20240620 for deerapi compatibility
    const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20240620';
    console.log('[AI] Using model:', model);

    const response = await getAnthropic().messages.create({
      model: model,
      max_tokens: 2000,
      system: systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    // Extract JSON from response
    const content = response.content[0];
    let jsonString = '';

    if (content.type === 'text') {
      jsonString = content.text;
    }

    console.log('AI Raw Response:', jsonString.substring(0, 100) + '...');

    // Robust JSON extraction
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in AI response');
      throw new Error('No valid JSON found in AI response');
    }
    
    jsonString = jsonMatch[0];

    // Parse JSON
    let invoiceData: InvoiceData;
    try {
      invoiceData = JSON.parse(jsonString) as InvoiceData;
    } catch (e) {
      console.error('Failed to parse AI JSON:', jsonString);
      throw new Error('Invalid JSON format from AI');
    }

    // Ensure items is an array
    if (!invoiceData.items || !Array.isArray(invoiceData.items)) {
      invoiceData.items = [];
    }

    // Validate and calculate totals
    invoiceData.items.forEach((item) => {
      if (!item.total) {
        item.total = item.quantity * item.unitPrice;
      }
    });

    // Calculate subtotal
    invoiceData.subtotal = invoiceData.items.reduce((sum, item) => sum + (item.total || 0), 0);

    // Calculate discount if present
    let taxableAmount = invoiceData.subtotal;
    if (invoiceData.discount) {
      if (invoiceData.discount.percent) {
        invoiceData.discount.amount = taxableAmount * (invoiceData.discount.percent / 100);
      }
      taxableAmount -= invoiceData.discount.amount || 0;
    }

    // Calculate tax on amount after discount
    if (invoiceData.tax && invoiceData.tax.rate) {
      invoiceData.tax.amount = taxableAmount * (invoiceData.tax.rate / 100);
    }

    // Calculate total
    invoiceData.total = taxableAmount + (invoiceData.tax?.amount || 0);

    // Set today's date if issueDate is not set
    if (!invoiceData.invoice.issueDate) {
      const today = new Date();
      invoiceData.invoice.issueDate = today.toISOString().split('T')[0];
    }

    // Calculate due date based on payment terms if not set
    if (!invoiceData.invoice.dueDate && invoiceData.invoice.paymentTerms) {
      const issueDate = new Date(invoiceData.invoice.issueDate);
      const daysMap: { [key: string]: number } = {
        'Due on receipt': 0,
        'Net 15': 15,
        'Net 30': 30,
        'Net 60': 60,
        'Net 90': 90,
      };
      const days = daysMap[invoiceData.invoice.paymentTerms] || 30;
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + days);
      invoiceData.invoice.dueDate = dueDate.toISOString().split('T')[0];
    }

    return invoiceData;
  } catch (error: any) {
    console.error('Error generating invoice:', error);
    if (error.status === 401) {
      throw new Error('Invalid Anthropic API Key. Please check your .env.local file.');
    }
    if (error.status === 429) {
      throw new Error('Anthropic API rate limit exceeded. Please try again in a moment.');
    }
    throw new Error('Failed to generate invoice from AI: ' + (error.message || 'Unknown error'));
  }
}

/**
 * Chat with Claude for invoice-related questions
 */
export async function chatWithClaude(
  message: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const systemPrompt = `You are a helpful assistant for an AI invoice generator. Help users:
- Create professional invoices
- Understand invoice requirements
- Answer questions about billing and invoicing
- Suggest best practices for freelancers

Keep responses concise and friendly. If users want to generate an invoice, guide them to provide the necessary information:
- Customer name and company
- Services/products provided
- Quantity and rates
- Any specific terms or notes`;

    const messages: ChatMessage[] = [
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message },
    ];

    const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20240620';

    const response = await getAnthropic().messages.create({
      model: model,
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const content = response.content[0];
    return content.type === 'text' ? content.text : 'I apologize, I could not generate a response.';
  } catch (error) {
    console.error('Error chatting with Claude:', error);
    throw new Error('Failed to get AI response');
  }
}

export default getAnthropic;
