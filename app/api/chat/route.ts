import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateInvoiceFromChat, ChatMessage } from '@/lib/claude';
import { getOrCreateProfile } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check if ANTHROPIC_API_KEY is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not configured');
      return NextResponse.json(
        {
          error: 'API configuration error',
          details: 'AI service is not properly configured. Please contact support.',
        },
        { status: 500 }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const body = await request.json();
    const { messages, userContext } = body as {
      messages: ChatMessage[];
      userContext?: {
        currency?: string;
        country?: string;
        companyName?: string;
      };
    };

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    // Get user profile to include in invoice generation
    let profile: any = userId ? await getOrCreateProfile(userId) : null;

    // Default profile for anonymous users
    if (!profile) {
      profile = {
        company_name: '',
        address: '',
        phone: '',
        website: '',
        tax_id: '',
        logo_url: '',
        payment_instructions: '',
        default_tax_rate: 0,
        default_currency: userContext?.currency || 'USD',
        payment_terms: 'Net 30',
        invoice_prefix: 'INV',
      };
    }

    // Merge user context with profile data
    const enhancedContext = {
      ...userContext,
      profile: {
        companyName: profile.company_name,
        address: profile.address,
        phone: profile.phone,
        website: profile.website,
        taxId: profile.tax_id,
        logo: profile.logo_url,
        paymentInstructions: profile.payment_instructions,
        defaultTaxRate: profile.default_tax_rate,
        defaultCurrency: profile.default_currency,
        paymentTerms: profile.payment_terms,
      },
      currency: profile.default_currency,
      country: 'US',
      companyName: profile.company_name,
    };

    // Generate invoice from conversation
    const invoiceData = await generateInvoiceFromChat(messages, enhancedContext);

    // Add invoice number from profile
    const invoiceNumber = `${profile.invoice_prefix}-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;
    invoiceData.invoice.invoiceNumber = invoiceNumber;

    // Add payment instructions from profile if not set
    if (!invoiceData.payment && profile.payment_instructions) {
      invoiceData.payment = {
        instructions: profile.payment_instructions,
      };
    }

    // Set default payment terms if not set
    if (!invoiceData.invoice.paymentTerms) {
      invoiceData.invoice.paymentTerms = profile.payment_terms || 'Net 30';
    }

    return NextResponse.json({
      success: true,
      invoice: invoiceData,
    });
  } catch (error: any) {
    console.error('Error in chat API:', error);

    // Provide more specific error messages
    let errorMessage = 'Failed to generate invoice';
    if (error?.message?.includes('API key')) {
      errorMessage = 'AI service configuration error';
    } else if (error?.message?.includes('rate limit')) {
      errorMessage = 'AI service is busy. Please try again.';
    } else if (error?.status === 401) {
      errorMessage = 'AI authentication failed';
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
