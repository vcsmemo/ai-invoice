import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { supabase } from './supabase';
import { createUser, getUserByEmail } from './supabase';

// Get the app URL from environment or construct from VERCEL_URL
const getAppUrl = () => {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    EmailProvider({
      server: process.env.RESEND_API_KEY ? {
        host: process.env.RESEND_API_HOST || 'https://api.resend.com',
        auth: process.env.RESEND_API_KEY,
        secure: true,
      } : '',
      from: process.env.EMAIL_FROM || 'noreply@aiinvoicegenerators.com',
    }),
  ],
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        console.error('SignIn Error: No email provided');
        return false;
      }

      try {
        // Check if user exists in our database
        let dbUser = await getUserByEmail(user.email);

        if (!dbUser) {
          console.log(`Creating new user: ${user.email}`);

          // Create new user
          dbUser = await createUser({
            email: user.email,
            name: user.name || '',
            avatar_url: user.image || '',
            credits_remaining: 5, // Free tier: 5 credits
          });

          if (!dbUser) {
            console.error('Failed to create user in database');
            // Allow login anyway - user will be created on next request
            user.id = user.email || 'temp-id';
            user.credits_remaining = 5;
            return true;
          }

          console.log(`User created successfully: ${dbUser.id}`);
        } else {
          console.log(`User found: ${dbUser.id}`);
        }

        // Add user ID to the session
        user.id = dbUser.id;
        user.credits_remaining = dbUser.credits_remaining;

        return true;
      } catch (error: any) {
        // Log detailed error
        console.error('Error in signIn callback:', {
          message: error?.message || 'Unknown error',
          stack: error?.stack,
          email: user.email,
          error: error
        });

        // Allow login anyway for better UX
        user.id = user.email || 'fallback-id';
        user.credits_remaining = 5;
        return true;
      }
    },
    async session({ session, user }) {
      if (session.user) {
        // Fetch fresh user data from database
        const dbUser = await getUserByEmail(session.user.email || '');
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.credits_remaining = dbUser.credits_remaining;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.credits_remaining = user.credits_remaining;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Explicitly set the URL for NextAuth to avoid redirect_uri_mismatch
  ...(process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? {
    url: getAppUrl(),
  } : {}),
};
