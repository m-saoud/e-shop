import NextAuth from "next-auth";
import  {NextAuthConfig}  from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SignCredentials } from "@/app/types";

const  AuthConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
      },
      async authorize(credentials, req) {
        try {
          const { email, password } = credentials as SignCredentials;

          // Validate email and password (add your validation logic here)

          // Send request to the API route for signing in
          const response = await fetch(
            "http://localhost:3000/api/users/signin",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            }
          );

          if (!response.ok) {
            throw new Error("Authentication failed");
          }

          const { user, error } = await response.json();
          if (error) {
            throw new Error(error);
          }

          return { id: user.id };
        } catch (error: any) {
          // Handle errors here, log them, and return an appropriate response
          throw new Error(`Authentication error: ${error.message}`);
        }
      },
    }),
  ],
};

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(AuthConfig);
