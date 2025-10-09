import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { DefaultSession } from "next-auth";

// Extend the built-in session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      provider?: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.provider = token.provider as string;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },

    // Callback when sign in is successful
    async signIn({ user, account, profile }) {
      // The user will be synced with our database through the AuthSyncProvider component
      // This happens client-side to avoid API route complexity

      if (!user || !user.email) {
        console.error("Invalid user data during sign in");
        return false;
      }

      return true; // Return false to reject sign in
    },
  },

  pages: {
    signIn: "/auth/signin", // Custom sign in page
    error: "/auth/error", // Error page
    // signOut: "/auth/signout",
    // verifyRequest: "/auth/verify-request",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
