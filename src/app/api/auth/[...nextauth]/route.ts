// export { GET, POST } from '@../../../auth'
import GoogleProvider from "next-auth/providers/google";

import NextAuth, { NextAuthConfig } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import { SignCredentials } from "@/app/types";
import { NextConfig } from "next";

const AuthConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(SignCredentials, req) {
        const { email, password } = SignCredentials as SignCredentials;
        // Send request to the API route for signing in
        const apiUrl = `${process.env.AUTH_URL}/api/users/signin`;
        const { user, error } = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }).then(async (res) => await res.json());
        if (error) return null;
        if (!error) {
          return { id: user.id, ...user };
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
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
        params.session.user = { ...params.session.user, ...user } as any;
      }
      return params.session;
    },
  },
};
export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(AuthConfig);
