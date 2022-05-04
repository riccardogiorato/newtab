import { calendar, auth } from "@googleapis/calendar";
import { getAccessTokenFromEmail } from "./auth";

export const getCalendarApi = ({ access_token }: { access_token: string }) => {
  const authCalendarGoogle = new auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  });
  authCalendarGoogle.setCredentials({
    access_token: access_token,
  });

  const calendarApi = calendar({
    version: "v3",
    auth: authCalendarGoogle,
  });

  return calendarApi;
};

export const getCalendarList = async ({ email }: { email: string }) => {
  const access_token = await getAccessTokenFromEmail(email);

  if (!access_token) {
    return undefined;
  }

  const result = await getCalendarApi({
    access_token,
  }).calendarList.list();
  return result.data.items;
};
