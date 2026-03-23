import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { supabase } from './supabase';
import { createUser, getUserByEmail } from './supabase';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        // Check if user exists in our database
        let dbUser = await getUserByEmail(user.email);

        if (!dbUser) {
          // Create new user
          dbUser = await createUser({
            email: user.email,
            name: user.name || '',
            avatar_url: user.image || '',
            credits_remaining: 5, // Free tier: 5 credits
          });

          if (!dbUser) {
            console.error('Failed to create user');
            return false;
          }
        }

        // Add user ID to the session
        user.id = dbUser.id;
        user.credits_remaining = dbUser.credits_remaining;

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
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
};
