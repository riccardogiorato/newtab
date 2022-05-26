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

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(refreshToken: string) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    const accountId = await prisma.account.findMany({
      where: {
        refresh_token: refreshToken,
      },
      select: {
        id: true,
      },
      take: 1,
    });

    if (accountId && accountId[0].id) {
      await prisma.account.update({
        where: {
          id: accountId[0].id,
        },
        data: {
          access_token: refreshedTokens.access_token,
          expires_at: Math.ceil(
            new Date().getTime() / 1000 + refreshedTokens.expires_in
          ),
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
}

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
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "",
  jwt: {
    secret: process.env.NEXTAUTH_SECRET || "",
  },
  // debug: true,
  pages: {
    // signIn: "/",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // console.log("sigIn", user, account, profile, email, credentials);
      return true;
    },
    async redirect({ url, baseUrl }) {
      //console.log("redirect", url, baseUrl);
      return baseUrl;
    },
    async session({ session, token, user }) {
      // console.log("session", session, token, user);

      const accounts = await prisma.user.findUnique({
        where: { email: session?.user?.email || "" },
        select: {
          accounts: {
            select: {
              access_token: true,
              refresh_token: true,
              expires_at: true,
            },
          },
        },
      });
      const account = accounts?.accounts[0];

      if (
        account &&
        account?.expires_at &&
        account?.refresh_token &&
        new Date(account?.expires_at * 1000) < new Date()
      ) {
        console.log("refreshing token");
        await refreshAccessToken(account.refresh_token);
      }

      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      //console.log("jwt", token, user, account, profile, isNewUser);
      return token;
    },
  },
});
