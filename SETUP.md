# Setup Guide

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to SQL Editor in your Supabase dashboard
3. Copy and run the SQL from `supabase/schema.sql`
4. Get your API credentials:
   - Go to Settings → API
   - Copy `Project URL` and `anon public key`

5. Enable Google OAuth:
   - Go to Authentication → Providers
   - Enable Google provider
   - Add your authorized redirect URLs (e.g., `http://localhost:3000/auth/callback`)

6. Update `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## 2. Google Cloud Console Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API:
   - Go to APIs & Services → Library
   - Search for "Google+ API" and enable it

4. Create OAuth 2.0 credentials:
   - Go to APIs & Services → Credentials
   - Create credentials → OAuth client ID
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/callback`
     - `https://your-domain.com/auth/callback`

5. Update `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   ```

## 3. Stripe Setup

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Get your API keys:
   - Go to Developers → API keys
   - Copy your secret key (starts with `sk_test_...`)

3. Create products in Stripe:
   - Go to Products → Add product
   - Create 3 credit packages:
     - 10 credits - $9
     - 50 credits - $35
     - 100 credits - $59

4. Update `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_your_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   ```

5. Setup webhook:
   - Go to Developers → Webhooks → Add endpoint
   - Endpoint URL: `https://your-domain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`

## 4. Anthropic (Claude API) Setup

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Get your API key from Settings → API Keys

3. Update `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

## 5. Run the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment template:
   ```bash
   cp .env.local.example .env.local
   ```

3. Fill in all the values in `.env.local`

4. Run development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables Checklist

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Anthropic Claude
ANTHROPIC_API_KEY=

# Resend (for emails)
RESEND_API_KEY=
```
