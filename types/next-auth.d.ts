import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      credits_remaining: number;
    };
  }

  interface User {
    id: string;
    credits_remaining: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    credits_remaining: number;
  }
}
