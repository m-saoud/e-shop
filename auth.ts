import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import CredentialsProvider from "next-auth/providers/credentials";
import { SignCredentials } from "@/app/types";
import { ifError } from "assert";

const nextAuthConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as SignCredentials;
        //send request to api route where you can sign in
        // you user and send error or successrespons to this function
        const { user, error } = await fetch(
          "http://localhost:3000/api/users/signin",
          {
            method: "POST",
            body: JSON.stringify({ email, password }),
          }
        ).then(async (res) => await res.json());
        if (error) throw new Error(error);
        return { id: user.id };
      },
    }),
  ],
};

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(nextAuthConfig);
