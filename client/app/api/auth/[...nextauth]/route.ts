import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { DefaultSession } from "next-auth";

// Extend the built-in session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
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
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // Callback khi sign in thành công
    async signIn({ user, account, profile }) {
      // Ở đây bạn có thể:
      // 1. Lưu user vào database
      // 2. Check whitelist
      // 3. Custom logic khác

      console.log("User signed in:", user);
      console.log("Account:", account);
      console.log("Profile:", profile);

      // TODO: Lưu user vào database của bạn
      // await saveUserToDatabase(user);

      return true; // Return false để reject sign in
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
