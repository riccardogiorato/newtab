import type { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "next-auth/react";
import { getCalendarApi, getCalendarList } from "../../../utils/calendar";
import { getAccessTokenFromEmail } from "../../../utils/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session || !session.user?.email) {
    return res.status(401).end();
  }

  const calendarListItems = await getCalendarList({
    email: session.user.email,
  });
  const primaryCalendar = calendarListItems?.find(
    (calendar) => calendar.primary === true
  );

  if (!primaryCalendar) {
    return res.status(401).end();
  }

  const access_token = await getAccessTokenFromEmail(session.user.email);

  if (!access_token) {
    return res.status(401).end();
  }

  const calendarApi = getCalendarApi({
    access_token,
  });

  const result = await calendarApi.events.list({
    calendarId: primaryCalendar.id as string,
    timeMin: new Date().toISOString(),
    maxResults: 10,
    orderBy: "startTime",
    singleEvents: true,
  });

  res.status(200).json(result.data);
}
