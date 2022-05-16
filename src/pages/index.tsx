/* eslint-disable @next/next/no-img-element */
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { signIn, useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Button } from "../components/Button";
import { GoogleSignIn } from "../components/GoogleSignIn";
import { getEventColor } from "../utils/calendarClient";

const fetcher = (...args: any[]) =>
  fetch([...args] as unknown as RequestInfo).then((res) => res.json());

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getTime(): string {
  const currentD = new Date();
  const currentT: string = currentD.toLocaleTimeString("en-GB");
  return currentT.slice(0, -3);
}

function getDay(): string {
  const today: Date = new Date();
  const month = capitalize(today.toLocaleString("en-GB", { month: "long" }));
  const day = capitalize(today.toLocaleString("en-GB", { weekday: "long" }));
  return day + " " + today.getDate() + ", " + month;
}

function getWeek(): string {
  // https://stackoverflow.com/a/6117889/9295292
  const today: Date = new Date();
  let d = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return (
    "Week " +
    Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  );
}

type GoogleEvent = {
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
  hangoutLink: string;
  colorId: string;
};

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  serverTime,
  serverDay,
  serverWeek,
}) => {
  const { data: session, status } = useSession();
  // const [whatCurrentThing, setCurrentThing] = useState(capitalize("sleeping"));
  /*
      if (hour >= 9 && hour < 13 && whatCurrentThing) {
      setCurrentThing(capitalize("🛠 working 9to5 - Morning"));
    }
    if (hour >= 13 && hour < 14 && whatCurrentThing) {
      setCurrentThing(capitalize("having Lunch 🍝"));
    }
    if (hour >= 14 && hour < 18 && whatCurrentThing) {
      setCurrentThing(capitalize("🛠 working 9to5 - Afternoon"));
    }
    */

  const [day, setDay] = useState(serverDay);
  const [time, setTime] = useState(serverTime);
  const [week, setWeek] = useState(serverWeek);

  useEffect(() => {
    setDay(getDay());
    setTime(getTime());
    setWeek(getWeek());
  }, []);

  setInterval(() => setTime(getTime), 2 * 1000);

  const [events, setEvents] = useState<GoogleEvent[]>([]);

  const { data, error } = useSWR("/api/events", fetcher);

  useEffect(() => {
    if (data) {
      setEvents(data.items);
    }
  }, [data]);

  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);

  return (
    <div
      className="overflow-hidden w-full min-h-screen text-white bg-cover bg-black"
      style={{
        backgroundImage: "url(/img/beach.webp)",
      }}
    >
      <div className="w-full">
        <div className="flex flex-row justify-end">
          <div className="flex flex-row items-center p-4">
            {session?.user?.image && (
              <img
                alt=""
                src={session?.user?.image || ""}
                className="h-12 w-12 rounded mr-4"
              />
            )}
            {session && status === "authenticated" && (
              <Button className="" onClick={() => signOut()}>
                <span className="p-2">Sign out</span>
              </Button>
            )}

            {status === "unauthenticated" && (
              <GoogleSignIn onClick={() => signIn("google")} />
            )}
          </div>
        </div>
        <div className="container mx-auto min-h-[80vh] flex items-center justify-center">
          <div className="flex items-center">
            <div className="text-center self-center mx-auto">
              <p className="text-3xl opacity-50 leading-tight text-shadow-layered">
                {week}
              </p>
              <h1 className="text-9xl leading-tight text-shadow-layered">
                {time}
              </h1>
              <h1 className=" text-5xl leading-tight text-shadow-layered">
                {day}
              </h1>
              {/* <p className="text-2xl leading-relaxed mt-8 font-semibold">
                Now you should be {whatCurrentThing}.
              </p> */}
              <span className="mt-4 flex items-center justify-center">
                {status === "unauthenticated" ? (
                  <div className="flex flex-col">
                    <div className="p-4 mt-8 rounded bg-white text-gray-800">
                      <p className="pb-4 max-w-xs">
                        Login with Google to visualize all your Google Calendar
                        Events for today, like this!
                      </p>
                      <img
                        src="/events.jpg"
                        alt="Events"
                        className="max-w-xs mx-auto"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="opacity-0">.</div>
                )}
              </span>
              {events.length > 0 && (
                <div className="flex flex-col">
                  <ul className="mt-4">
                    {events
                      .filter(
                        (event, indexEvent) =>
                          new Date(event.start.dateTime) < midnight &&
                          new Date(event.start.dateTime) > new Date() &&
                          indexEvent < 5
                      )
                      .map((event: GoogleEvent) => (
                        <li
                          key={event.summary}
                          style={{
                            backgroundColor: getEventColor(event.colorId)
                              .background,
                            color: getEventColor(event.colorId).foreground,
                          }}
                          className="my-4 p-2 font-bold rounded"
                        >
                          <a
                            href={event.hangoutLink}
                            className={
                              event.hangoutLink && "underline text-xl "
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {event.summary}{" "}
                            {new Date(event.start.dateTime).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                            {" - "}
                            {new Date(event.end.dateTime).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      serverTime: getTime(),
      serverDay: getDay(),
      serverWeek: getWeek(),
    },
    revalidate: 1,
  };
};

export default Home;
