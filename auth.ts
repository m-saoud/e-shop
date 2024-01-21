import NextAuth, { NextAuthConfig } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import { SignCredentials } from "@/app/types";

const AuthConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials: any, req: any): Promise<any | null> {
        const { email, password } = credentials as SignCredentials;

        // Send request to the API route for signing in
        const baseUrl = "http://localhost:3000/api/users/signin";
        const { user, error } = await fetch(baseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }).then(async (res) => await res.json());
        if (error) return null;
        if (!error) {
          return { id: user._id, ...user };
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: null!, // Will disable the new account creation screen
  },
  callbacks: {
    async jwt(params) {
      if (params.user) {
        params.token.user = params.user;
      }
      return params.token;
    },
    async session(params) {
      const user = params.token.user;
      if (user) {
        params.token.user = {
          ...params.session.user,
          ...user,
        };
      }
      return params.session;
    },
  },
};

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(AuthConfig);
