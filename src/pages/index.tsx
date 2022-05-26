/* eslint-disable @next/next/no-img-element */
import { signIn, useSession } from "next-auth/react";
import Router from "next/router";
import { GoogleSignIn } from "../components/GoogleSignIn";
const Home = () => {
  const { data: session, status } = useSession();

  if (status === "authenticated" && session?.user) {
    Router.push("/app");
  }

  return (
    <div
      className="overflow-hidden w-full min-h-screen text-white bg-cover bg-black"
      style={{
        backgroundImage: "url(/img/beach.webp)",
      }}
    >
      {status === "unauthenticated" && (
        <div className="flex flex-col items-center my-4">
          <h1 className="text-5xl"> newtab </h1>
          <h2 className="text-3xl mb-4"> minimal newtab page</h2>
          <GoogleSignIn
            onClick={() =>
              signIn("google", {
                callbackUrl: "/app",
              })
            }
          />
          <span className="mt-4 flex items-center justify-center">
            <div className="flex flex-col">
              <div className="p-4 mt-8 rounded bg-white text-gray-800">
                <p className="pb-4 max-w-xs">
                  Login with Google to visualize all your Google Calendar Events
                  for today, like this!
                </p>
                <img
                  src="/events.jpg"
                  alt="Events"
                  className="max-w-xs mx-auto"
                />
              </div>
            </div>
          </span>
        </div>
      )}
    </div>
  );
};

export default Home;
