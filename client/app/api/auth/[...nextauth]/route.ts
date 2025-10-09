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
      if (!user || !user.email) {
        console.error("Invalid user data during sign in");
        return false;
      }

      const provider = account?.provider ?? "credentials";
      const userId =
        account?.providerAccountId ??
        (typeof profile === "object" && profile && "sub" in profile
          ? (profile as Record<string, string>).sub
          : undefined) ??
        (typeof profile === "object" && profile && "id" in profile
          ? (profile as Record<string, string>).id
          : undefined) ??
        user.id ??
        user.email;

      if (!userId) {
        console.error("Unable to resolve user identifier during sign in");
        return false;
      }

      const serviceKey =
        process.env.SERVICE_API_KEY ?? process.env.NEXT_PUBLIC_SERVICE_API_KEY;

      if (!serviceKey) {
        console.error("SERVICE_API_KEY is not configured on the server");
        return false;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/auth`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-service-key": serviceKey,
            },
            body: JSON.stringify({
              userId,
              email: user.email,
              name: user.name ?? "",
              image: user.image,
              provider,
            }),
          }
        );

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          console.error("Failed to sync user during sign in", {
            status: response.status,
            statusText: response.statusText,
            body: errorBody,
          });
          return false;
        }

        return true;
      } catch (error) {
        console.error("Unexpected error syncing user during sign in", error);
        return false;
      }
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
