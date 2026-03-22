import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// Credit packages
export const CREDIT_PACKAGES = {
  starter: {
    name: 'Starter Pack',
    credits: 10,
    price: 900, // $9.00 in cents
    description: 'Perfect for occasional use',
  },
  professional: {
    name: 'Professional Pack',
    credits: 50,
    price: 3500, // $35.00 in cents
    description: 'Best value for freelancers',
  },
  business: {
    name: 'Business Pack',
    credits: 100,
    price: 5900, // $59.00 in cents
    description: 'Maximum savings',
  },
} as const;

export type CreditPackage = keyof typeof CREDIT_PACKAGES;

// Calculate price in dollars
export function getPriceInDollars(priceInCents: number): string {
  return (priceInCents / 100).toFixed(2);
}

// Format price for display
export function formatPrice(packageId: CreditPackage): string {
  const pkg = CREDIT_PACKAGES[packageId];
  return `$${getPriceInDollars(pkg.price)}`;
}
