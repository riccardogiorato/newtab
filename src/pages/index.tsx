import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { useEffect, useState } from "react";

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

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  serverTime,
  serverDay,
  serverWeek,
}) => {
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

  setInterval(() => setTime(getTime), 60 * 1000);

  return (
    <div className="overflow-hidden w-screen h-screen">
      <div
        className="w-screen h-screen text-white bg-cover bg-black"
        style={{
          backgroundImage: "url(/img/beach.webp)",
        }}
      >
        <div className="container mx-auto">
          <div className="flex items-center h-screen">
            <div className="text-center self-center mx-auto text-shadow-layered">
              <p className="text-3xl opacity-50 leading-tight">{week}</p>
              <h1 className="text-9xl leading-tight">{time}</h1>
              <h1 className=" text-5xl leading-tight">{day}</h1>
              {/* <p className="text-2xl leading-relaxed mt-8 font-semibold">
                Now you should be {whatCurrentThing}.
              </p> */}
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
