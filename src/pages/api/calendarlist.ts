import type { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session || !session.user?.email) {
    return res.status(401).end();
  }

  const account = await prisma.user.findUnique({
    where: { email: session?.user?.email },
    select: {
      accounts: {
        select: {
          access_token: true,
        },
      },
    },
  });

  // fetch data from google apis
  const result = await fetch(
    `https://www.googleapis.com/calendar/v3/users/me/calendarList?key=${process.env.GOOGLE_API_KEY}`,
    {
      headers: {
        Authorization: `Bearer ${account?.accounts[0].access_token}`,
      },
      method: "GET",
    }
  );
  res.status(200).json(await result.json());
}
