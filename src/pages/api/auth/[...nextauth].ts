import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
const googleScopes = [
  "openid",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: googleScopes.join(" "),
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "",
  // debug: true,
  pages: {
    // signIn: "/",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      //console.log("sigIn", user, account, profile, email, credentials);
      return true;
    },
    async redirect({ url, baseUrl }) {
      //console.log("redirect", url, baseUrl);
      return baseUrl;
    },
    async session({ session, token, user }) {
      //console.log("session", session, token, user);
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      //console.log("jwt", token, user, account, profile, isNewUser);
      return token;
    },
  },
});
