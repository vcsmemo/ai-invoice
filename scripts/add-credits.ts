import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const admin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function addCredits() {
  const email = 'johntian2015@gmail.com';
  const amount = 100;

  console.log('Adding', amount, 'credits to', email);

  // Find user by email
  const { data: user, error: findError } = await admin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (findError) {
    console.error('Error finding user:', findError);
    return;
  }

  if (!user) {
    console.error('User not found:', email);
    return;
  }

  console.log('Found user:', user.id, 'Current credits:', user.credits_remaining);

  // Update credits
  const { data: updatedUser, error: updateError } = await admin
    .from('users')
    .update({ credits_remaining: (user.credits_remaining || 0) + amount })
    .eq('id', user.id)
    .select()
    .single();

  if (updateError) {
    console.error('Error updating credits:', updateError);
    return;
  }

  console.log('✅ Success!');
  console.log('Previous balance:', user.credits_remaining);
  console.log('Added:', amount);
  console.log('New balance:', updatedUser.credits_remaining);
}

addCredits();
