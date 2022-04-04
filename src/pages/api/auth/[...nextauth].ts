import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const googleScopes = [
  "openid",
  "https://www.googleapis.com/auth/calendar.readonly",
];

export default NextAuth({
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
  debug: true,
  pages: {
    // signIn: "/",
  },
});
