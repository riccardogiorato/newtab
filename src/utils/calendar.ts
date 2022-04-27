import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAccessTokenFromEmail = async (email: string) => {
  const account = await prisma.user.findUnique({
    where: { email: email },
    select: {
      accounts: {
        select: {
          access_token: true,
        },
      },
    },
  });
  return account?.accounts[0]?.access_token || undefined;
};

export const getCalendarList = async ({ email }: { email: string }) => {
  const access_token = getAccessTokenFromEmail(email);

  // fetch data from google apis
  const result = await fetch(
    `https://www.googleapis.com/calendar/v3/users/me/calendarList?key=${process.env.GOOGLE_API_KEY}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      method: "GET",
    }
  );
  return await result.json();
};
