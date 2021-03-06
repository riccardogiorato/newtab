import React, { useState, useEffect, Fragment } from 'react';
import bent from 'bent';

function geturlparams(name: string): string {
  // courtesy of https://stackoverflow.com/a/5158301/3216524 //
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  if (match) return decodeURIComponent(match[1].replace(/\+/g, ' '));
  else return '';
}

const AUTH_CALENDAR_KEY = 'calendar_auth';

function CalendarEvents(): JSX.Element {
  const [loading, SetLoading] = useState(true);
  const [token, SetToken] = useState('');
  const [urlLogin, SetLoginUrl] = useState('');
  const [events, SetEvents] = useState([]);

  const Login = () => {
    if (urlLogin !== '') window.location.href = urlLogin;
  };

  useEffect(() => {
    // if (urlLogin !== '') window.location.href = urlLogin;
  }, [urlLogin]);

  useEffect(() => {
    const getCalendarEvents = async () => {
      // http://localhost:8888/?token=ya29.a0AfH6SMCneraBQuN2R0VeawFfaYelEr5qFDLZjeNpexnWZnI5x_5EkUs9u8StP-OWfwaxGt_A5KMOJtmfxpfhvR43XRMKAg4lXDhU-_MIAZWNMujtK6hry1_5fcgfIMEuppsK-_MKZa8g8ok1IpkVtC9NbGquDzUaWgo
      let start = new Date();
      let end = new Date();
      end.setHours(23, 59, 59, 999);

      try {
        const getCalendarAPI = bent(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          'GET',
          'json'
        );

        const allDay: any = await getCalendarAPI(
          `?singleEvents=true&timeMax=${end.toISOString()}&timeMin=${start.toISOString()}&orderBy=startTime`,
          undefined,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        if (allDay) {
          SetEvents(allDay.items);
        }
      } catch (e) {
        window.localStorage.removeItem(AUTH_CALENDAR_KEY);
        window.location.reload(true);
      }
    };
    if (token !== '') {
      window.localStorage.setItem(AUTH_CALENDAR_KEY, token);
      getCalendarEvents();
    }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      const windowToken = window.location.search.indexOf('token') > -1;
      const localToken = window.localStorage.getItem(AUTH_CALENDAR_KEY);

      if (windowToken || localToken) {
        if (windowToken) SetToken(geturlparams('token'));
        if (localToken) SetToken(localToken);
      } else {
        const getJSON = bent(window.location.href, 'GET', 'json');
        const res: any = await getJSON('.netlify/functions/google-auth');
        if (res) {
          SetLoginUrl(res.redirectURL);
        }
      }
      SetLoading(false);
    };
    fetchData();
  }, []);

  const eventsOnUI = events.map((event: any, index: Number) => {
    let eventText: string = event.summary;
    if (event.start.dateTime) {
      const start: string = new Date(event.start.dateTime).toLocaleTimeString(
        'en-GB'
      );
      const startTime: string = start.slice(0, -3);
      const end: string = new Date(event.end.dateTime).toLocaleTimeString(
        'en-GB'
      );
      const endTime: string = end.slice(0, -3);
      eventText += ' - ' + startTime + ' - ' + endTime;
    }

    return <div className="my-2 firstLetterCapitalize">[ {eventText} ]</div>;
  });

  let calendarEventUi: JSX.Element = <Fragment></Fragment>;

  if (!loading) {
    if (token === '') {
      calendarEventUi = (
        <div className="flex justify-center opacity-50">
          <button
            className="absolute opacity-25 m-2 border-2 p-2 rounded text-gray-300 bottom-0"
            onClick={Login}
          >
            Login to see events
          </button>
        </div>
      );
    } else {
      calendarEventUi = (
        <Fragment>
          <br />
          <div className="events">{eventsOnUI}</div>
        </Fragment>
      );
    }
  }
  return calendarEventUi;
}

export default CalendarEvents;
