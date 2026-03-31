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
    const systemPrompt = `You are an expert invoice generation assistant. Extract invoice information from user input and generate structured JSON data.

CONTEXT:
- Currency: ${userContext?.currency || 'USD'}
- Company: ${userContext?.companyName || 'Not specified'}

TASK:
Extract invoice items and customer information. Handle multiple items (separated by semicolons, commas, or line breaks).

EXAMPLES:
- "Logo design, $500" → {description:"Logo design", quantity:1, unitPrice:500, total:500}
- "40 hours at $300/hour" → {description:"Web dev", quantity:40, unitPrice:300, total:12000}
- "20 hours web dev for ABC Company at $100/hour" → customer:ABC Company, item:{description:"Web dev", quantity:20, unitPrice:100, total:2000}

REQUIRED OUTPUT FORMAT (JSON only):
{
  "from": {
    "name": "", "company": "${userContext?.companyName || ''}", "email": "",
    "address": "", "phone": "", "website": "", "taxId": ""
  },
  "customer": {
    "name": "Customer Name (required)",
    "email": "", "company": "", "address": ""
  },
  "invoice": {
    "invoiceNumber": "", "issueDate": "${new Date().toISOString().split('T')[0]}",
    "dueDate": "", "currency": "${userContext?.currency || 'USD'}", "paymentTerms": "Net 30"
  },
  "items": [
    {"description": "Service description", "quantity": 1, "unitPrice": 0, "total": 0}
  ],
  "subtotal": 0,
  "total": 0
}

CALCULATION:
- subtotal = sum of (quantity × unitPrice) for all items
- total = subtotal (ignore tax unless specified)

Return ONLY the JSON object. No markdown, no explanations.`;

    // Using claude-3-5-sonnet-20240620 for deerapi compatibility
    const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20240620';
    console.log('[AI] Using model:', model);
    console.log('[AI] Sending request with', messages.length, 'messages');
    console.log('[AI] Last message:', messages[messages.length - 1]?.content?.substring(0, 200));

    const startTime = Date.now();

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);  // 25 second timeout

    let response;
    try {
      response = await getAnthropic().messages.create({
        model: model,
        max_tokens: 4000,  // Increased from 2000
        system: systemPrompt,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        // @ts-ignore - AbortSignal is supported but not in types
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (timeoutError: any) {
      clearTimeout(timeoutId);
      if (timeoutError.name === 'AbortError') {
        console.error('[AI] Request timeout after 25 seconds');
        throw new Error('AI request timeout. The service is taking too long to respond. Please try a simpler request.');
      }
      throw timeoutError;
    }

    const duration = Date.now() - startTime;
    console.log('[AI] Response received in', duration, 'ms');

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
