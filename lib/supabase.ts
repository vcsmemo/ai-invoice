import { createClient } from '@supabase/supabase-js';

let supabaseInstance: any = null;

export function getSupabase() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    // Use dummy values during build to prevent crash
    const url = supabaseUrl || 'https://placeholder.supabase.co';
    const key = supabaseAnonKey || 'placeholder';
    supabaseInstance = createClient(url, key);
  }
  return supabaseInstance;
}

// For backward compatibility
export const supabase = new Proxy({} as any, {
  get: (target, prop, receiver) => {
    return Reflect.get(getSupabase(), prop, receiver);
  }
});

// Supabase client for server-side operations (with service role key)
let supabaseAdminInstance: any = null;

export function getSupabaseAdmin() {
  if (!supabaseAdminInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    // Use dummy values during build to prevent crash
    const url = supabaseUrl || 'https://placeholder.supabase.co';
    const key = supabaseServiceRoleKey || 'placeholder';
    supabaseAdminInstance = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseAdminInstance;
}

// For backward compatibility
export const supabaseAdmin = new Proxy({} as any, {
  get: (target, prop, receiver) => {
    return Reflect.get(getSupabaseAdmin(), prop, receiver);
  }
});

// Database types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  credits_remaining: number;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string;
  invoice_data: any; // JSONB
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue';
  po_number?: string;
  payment_method?: string;
  paid_at?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  company_name?: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  website?: string;
  tax_id?: string;
  payment_instructions?: string;
  default_currency: string;
  default_tax_rate: number;
  invoice_prefix: string;
  payment_terms: string;
  auto_email_invoices?: boolean;
  cc_me_on_invoices?: boolean;
  created_at: string;
  updated_at: string;
}

export interface InvoiceData {
  // Sender (From) information
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

  // Customer (Bill To) information
  customer: {
    name: string;
    email?: string;
    company?: string;
    address?: string;
  };

  // Invoice metadata
  invoice: {
    invoiceNumber: string;
    poNumber?: string;
    issueDate: string;
    dueDate?: string;
    currency: string;
    notes?: string;
    paymentTerms?: string;
  };

  // Line items
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    sku?: string;
  }>;

  // Payment information
  payment?: {
    method?: string;
    bankAccount?: string;
    paypalEmail?: string;
    instructions?: string;
  };

  // Tax and totals
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
}

// User operations
export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }

  return data;
}

export async function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    return null;
  }

  return data;
}

export async function updateUserCredits(
  userId: string,
  creditsToAdd: number
): Promise<User | null> {
  // Fetch current credits
  const { data: user } = await supabase
    .from('users')
    .select('credits_remaining')
    .eq('id', userId)
    .single();

  if (!user) {
    console.error('User not found for credit update');
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .update({ credits_remaining: (user.credits_remaining || 0) + creditsToAdd })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user credits:', error);
    return null;
  }

  return data;
}

// Invoice operations
export async function createInvoice(
  userId: string,
  invoiceNumber: string,
  invoiceData: InvoiceData
): Promise<Invoice | null> {
  const { data, error } = await supabase
    .from('invoices')
    .insert({
      user_id: userId,
      invoice_number: invoiceNumber,
      invoice_data: invoiceData,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating invoice:', error);
    return null;
  }

  return data;
}

export async function getUserInvoices(userId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user invoices:', error);
    return [];
  }

  return data || [];
}

export async function getInvoiceById(invoiceId: string): Promise<Invoice | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from('invoices')
    .select('*')
    .eq('id', invoiceId)
    .single();

  if (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }

  return data;
}

// Check if user has enough credits
export async function checkUserCredits(userId: string): Promise<boolean> {
  const user = await getUserById(userId);
  return user ? user.credits_remaining > 0 : false;
}

// Profile operations
export async function getProfile(userId: string): Promise<Profile | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function createProfile(userId: string, profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from('profiles')
    .insert({ id: userId, ...profile })
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }

  return data;
}

export async function updateProfile(userId: string, updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>): Promise<Profile | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data;
}

export async function getOrCreateProfile(userId: string): Promise<Profile> {
  try {
    let profile = await getProfile(userId);

    if (!profile) {
      console.log('[Profile] Creating new profile for user:', userId);

      profile = await createProfile(userId, {
        default_currency: 'USD',
        default_tax_rate: 0,
        invoice_prefix: 'INV',
        payment_terms: 'Net 30',
      });

      if (!profile) {
        console.warn('[Profile] Failed to create profile in database, using defaults');
        // Return a default profile instead of throwing
        profile = {
          id: userId,
          default_currency: 'USD',
          default_tax_rate: 0,
          invoice_prefix: 'INV',
          payment_terms: 'Net 30',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      } else {
        console.log('[Profile] Profile created successfully');
      }
    } else {
      console.log('[Profile] Found existing profile');
    }

    return profile;
  } catch (error) {
    console.error('[Profile] Error in getOrCreateProfile:', error);
    // Return a default profile on any error
    return {
      id: userId,
      default_currency: 'USD',
      default_tax_rate: 0,
      invoice_prefix: 'INV',
      payment_terms: 'Net 30',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
}

// Invoice status operations
export async function updateInvoiceStatus(invoiceId: string, status: Invoice['status'], paidAt?: string): Promise<Invoice | null> {
  const admin = getSupabaseAdmin();
  const updateData: any = { status };

  if (status === 'paid' && paidAt) {
    updateData.paid_at = paidAt;
  }

  const { data, error } = await admin
    .from('invoices')
    .update(updateData)
    .eq('id', invoiceId)
    .select()
    .single();

  if (error) {
    console.error('Error updating invoice status:', error);
    return null;
  }

  return data;
}

// Generate invoice number based on user profile
export async function generateInvoiceNumber(userId: string): Promise<string> {
  const admin = getSupabaseAdmin();
  const profile = await getOrCreateProfile(userId);
  const prefix = profile?.invoice_prefix || 'INV';

  // Get the count of invoices for this user
  const { count } = await admin
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const sequenceNumber = (count || 0) + 1;
  const year = new Date().getFullYear();

  return `${prefix}-${year}-${sequenceNumber.toString().padStart(4, '0')}`;
}

export default supabase;
