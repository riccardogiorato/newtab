import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
  const [whatCurrentThing, setCurrentThing] = useState(capitalize("sleeping"));
  const [currentDay, setDay] = useState(theCurrentDay);
  const [currentTime, setTime] = useState(theCurrentTime);
  const [currentWeek, setWeek] = useState(theCurrentWeek);

  function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function theCurrentTime(): string {
    const currentD = new Date();
    const currentT: string = currentD.toLocaleTimeString("en-GB");
    if (currentT === "00:00:01") {
      setDay(theCurrentDay);
      setWeek(theCurrentWeek);
    }
    const hour: number = currentD.getHours();
    // const minutes: number = currentD.getMinutes();

    if (hour >= 9 && hour < 13 && whatCurrentThing) {
      setCurrentThing(capitalize("🛠 working 9to5 - Morning"));
    }
    if (hour >= 13 && hour < 14 && whatCurrentThing) {
      setCurrentThing(capitalize("having Lunch 🍝"));
    }
    if (hour >= 14 && hour < 18 && whatCurrentThing) {
      setCurrentThing(capitalize("🛠 working 9to5 - Afternoon"));
    }
    return currentT.slice(0, -3);
  }

  function theCurrentDay(): string {
    const today: Date = new Date();
    const month = capitalize(today.toLocaleString("en-GB", { month: "long" }));
    const day = capitalize(today.toLocaleString("en-GB", { weekday: "long" }));
    return day + " " + today.getDate() + ", " + month;
  }

  function theCurrentWeek(): string {
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

  const currentBackground = require("../background.json").background;

  setInterval(() => setTime(theCurrentTime), 60 * 1000);

  return (
    <div className="overflow-hidden w-screen h-screen">
      <div
        className="w-screen h-screen text-white bg-cover bg-black"
        style={{
          backgroundImage:
            "url(data:image/png;base64," + currentBackground + ")",
        }}
      >
        <div className="container mx-auto">
          <div className="flex items-center h-screen">
            <div className="text-center self-center mx-auto">
              <p className="text-3xl opacity-50 leading-tight">{currentWeek}</p>
              <h1 className="text-9xl leading-tight">{currentTime}</h1>
              <h1 className=" text-6xl leading-tight">{currentDay}</h1>
              <p className="text-2xl leading-relaxed mt-8 font-semibold">
                Now you should be {capitalize(whatCurrentThing)}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
