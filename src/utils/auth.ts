import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAccessTokenFromEmail = async (email: string) => {
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
