import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateInvoiceFromChat, ChatMessage } from '@/lib/claude';
import { getOrCreateProfile } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check if ANTHROPIC_API_KEY is configured
    console.log('Environment check:', {
      hasApiKey: !!process.env.ANTHROPIC_API_KEY,
      apiKeyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 10) + '...',
      hasBaseUrl: !!process.env.ANTHROPIC_BASE_URL,
      baseUrl: process.env.ANTHROPIC_BASE_URL || 'default (https://api.anthropic.com)',
    });

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
    console.log('User session:', { userId, hasSession: !!session });

    const body = await request.json();
    const { messages, userContext } = body as {
      messages: ChatMessage[];
      userContext?: {
        currency?: string;
        country?: string;
        companyName?: string;
      };
    };

    console.log('Request body:', { messagesCount: messages?.length, userContext });

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    // Get user profile to include in invoice generation
    let profile: any = userId ? await getOrCreateProfile(userId) : null;
    console.log('User profile:', { hasProfile: !!profile, profileKeys: profile ? Object.keys(profile) : [] });

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

    console.log('Calling generateInvoiceFromChat with context:', {
      messageCount: messages.length,
      lastMessage: messages[messages.length - 1]?.content?.substring(0, 100),
    });

    // Generate invoice from conversation
    const invoiceData = await generateInvoiceFromChat(messages, enhancedContext);

    console.log('Invoice generated successfully:', {
      hasCustomer: !!invoiceData.customer,
      itemsCount: invoiceData.items?.length,
      total: invoiceData.total,
    });

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
    console.error('Error in chat API:', {
      message: error?.message,
      status: error?.status,
      name: error?.name,
      stack: error?.stack?.substring(0, 500),
    });

    // Provide more specific error messages
    let errorMessage = 'Failed to generate invoice';
    let errorDetails = error instanceof Error ? error.message : 'Unknown error';

    if (error?.message?.includes('API key')) {
      errorMessage = 'AI service configuration error';
    } else if (error?.message?.includes('rate limit')) {
      errorMessage = 'AI service is busy. Please try again.';
    } else if (error?.status === 401) {
      errorMessage = 'AI authentication failed';
      errorDetails = 'Please check your ANTHROPIC_API_KEY and ANTHROPIC_BASE_URL';
    } else if (error?.status === 404 || error?.message?.includes('404')) {
      errorMessage = 'AI service endpoint not found';
      errorDetails = 'Please check ANTHROPIC_BASE_URL configuration';
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}
