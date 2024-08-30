import { Backend_URL } from "@/lib/Constants";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Username",
          type: "email",
          placeholder: "jsmith",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;
        const { email, password } = credentials;
        const res = await fetch(Backend_URL + "/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status == 401) {
          console.log(res.statusText);

          return null;
        }
        const user = await res.json();
        console.log("Authorized user:", user);
        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT Callback - User:", user, "Token:", token);

      if (user) return { ...token, ...user };

      return token;
    },

    async session({ token, session }) {
      console.log("Session Callback - Token:", token, "Session:", session);

      session.user = token.user;
      session.backendTokens = token.backendTokens;

      console.log(token, session);
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
