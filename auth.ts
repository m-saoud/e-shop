// import NextAuth, { NextAuthConfig } from "next-auth";
// import { connect } from "mongoose";

// import CredentialsProvider from "next-auth/providers/credentials";
// import { SignCredentials } from "@/app/types";

// const AuthConfig: NextAuthConfig = {
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {},

//       async authorize(credentials, req) {
//         const { email, password } = credentials as SignCredentials;

//         // Send request to the API route for signing in
//         const apiUrl = "http://localhost:3000/api/users/signin";
//         const { user, error } = await fetch(apiUrl, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ email, password }),
//         }).then(async (res) => await res.json());
//         if (error) return null;
//         if (!error) {
//           return { id: user._id, ...user };
//         }
//       },
//     }),
//   ],
// };
// export const {
//   auth,
//   handlers: { GET, POST },
// } = NextAuth(AuthConfig);
