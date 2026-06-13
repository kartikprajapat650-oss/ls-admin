import { type AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:4000';
const nextAuthUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const nextAuthSecret = process.env.NEXTAUTH_SECRET || 'change_this_secret_with_at_least_32_chars__';
process.env.NEXTAUTH_URL = nextAuthUrl;
process.env.NEXTAUTH_SECRET = nextAuthSecret;

export const authOptions: AuthOptions = {
  secret: nextAuthSecret,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const response = await fetch(`${backendUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            device: 'web',
            browser: 'Next.js',
          }),
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(errorBody.message || 'Invalid credentials');
        }

        const data = await response.json();
        return {
          ...data.user,
          accessToken: data.token,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 4 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          accessToken: (user as any).accessToken,
          user,
        } as JWT;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        const customSession = session as any;
        customSession.user = (token as any).user || session.user;
        customSession.accessToken = (token as any).accessToken;
        return customSession;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};
