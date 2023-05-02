import { Header } from "./Header";
import Image from "next/image";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import React, { useState } from "react";
import Head from "next/head";

const fetcher = (url: RequestInfo | URL) =>
  fetch(url).then((res) => res.json());

export function Home() {
  const { data: session } = useSession();
  // Update preview gif/image every second
  const { data, error } = useSWR("/api/getConfig", fetcher, {
    refreshInterval: 1000,
  });
  // Default form values
  const [formData, setFormData] = useState({
    url: "",
  });
  // Variable that displays if an error has occured or not
  const [formSuccessCode, setFormSuccessCode] = useState(Number);

  if (error) {
    return (
      <section className="flex h-full items-center dark:bg-gray-800 dark:text-gray-100 sm:p-16">
        <div className="container mx-auto my-8 flex flex-col items-center justify-center space-y-8 px-5 text-center sm:max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="h-40 w-40 dark:text-gray-600"
          >
            <path
              fill="currentColor"
              d="M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z"
            ></path>
            <rect
              width="176"
              height="32"
              x="168"
              y="320"
              fill="currentColor"
            ></rect>
            <polygon
              fill="currentColor"
              points="210.63 228.042 186.588 206.671 207.958 182.63 184.042 161.37 162.671 185.412 138.63 164.042 117.37 187.958 141.412 209.329 120.042 233.37 143.958 254.63 165.329 230.588 189.37 251.958 210.63 228.042"
            ></polygon>
            <polygon
              fill="currentColor"
              points="383.958 182.63 360.042 161.37 338.671 185.412 314.63 164.042 293.37 187.958 317.412 209.329 296.042 233.37 319.958 254.63 341.329 230.588 365.37 251.958 386.63 228.042 362.588 206.671 383.958 182.63"
            ></polygon>
          </svg>
          <p className="text-3xl">Something went wrong. Try again later</p>
        </div>
      </section>
    );
  }

  // While data is loading, show a loading animation
  if (!data)
    return (
      <div className="min-w-screen flex min-h-screen items-center justify-center bg-gray-800 p-5">
        <div className="flex animate-pulse space-x-2">
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
        </div>
      </div>
    );

  if (session) {
    // Define a delay
    const delay = (ms: number | undefined) =>
      new Promise((res) => setTimeout(res, ms));

    // Ensures that displayed form values are up to date and accurate
    const handleInput = (e: any) => {
      const fieldName = e.target.name;
      const fieldValue = e.target.value;

      setFormData((prevState) => ({
        ...prevState,
        [fieldName]: fieldValue,
      }));
    };

    // Handles the updating of GIF/Video source URL
    const handleSubmit = async (event: any) => {
      event.preventDefault();

      const data = {
        url: event.target.url.value,
      };

      const JSONdata = JSON.stringify(data);

      const endpoint = "/api/updateSource";

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONdata,
      };

      const response = await fetch(endpoint, options);

      const result = await response.json();
      if (result.code == 403) {
        setFormSuccessCode(403);
      } else {
        const logData = JSON.stringify({
          date: Date.now() + "",
          name: session.user!.name,
          type: result.type,
          url: data.url,
          expireDate: Date.now() + 7 * 24 * 60 * 60 * 1000 + "",
        });

        const logEndpoint = "/api/getLogs";
        const logOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: logData,
        };
        const logResponse = await fetch(logEndpoint, logOptions);
        const logResult = await logResponse.json();

        if (logResult.code == 200) {
          setFormData({
            url: "",
          });
          setFormSuccessCode(200);
          await delay(2000);
          setFormSuccessCode(418);
        } else {
          setFormSuccessCode(500);
          alert("Something went wrong, contact the system admin");
        }
      }
    };

    // If data grab errors, show a sad face

    return (
      <>
        <Head>
          <title>Home - {process.env.NEXT_PUBLIC_SITENAME}</title>
        </Head>
        <Header />
        <br />
        <div className="flex flex-col flex-wrap space-y-5 md:flex-row md:flex-nowrap md:space-y-0">
          <div className="pl-5 pr-5 md:container md:mx-auto md:pl-52">
            <fieldset className="space-y-1 dark:text-gray-100">
              <form onSubmit={handleSubmit}>
                <label htmlFor="url" className="block text-sm font-medium">
                  Link to GIF
                </label>
                <div className="flex flex-col space-y-2">
                  <input
                    type="url"
                    name="url"
                    id="url"
                    onChange={handleInput}
                    value={formData.url}
                    required
                    placeholder="https://media.giphy.com/media/fRB9j0KCRe0KY/giphy.gif"
                    className="flex flex-1 rounded-lg border focus:ring-inset focus:ring-yellow-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
                  />
                  {formSuccessCode == 200 ? (
                    <p className="text-sm text-green-500">Success!</p>
                  ) : (
                    <></>
                  )}
                  {formSuccessCode == 403 ? (
                    <p className="text-sm text-red-500">Wrong file type</p>
                  ) : (
                    <></>
                  )}
                  <div>
                    <button
                      type="submit"
                      className="rounded-lg px-6 py-2 font-semibold dark:bg-yellow-500 hover:dark:bg-yellow-400"
                    >
                      Update Gif
                    </button>
                  </div>
                </div>
              </form>
            </fieldset>
          </div>
          <div className="pl-5 pr-5 md:pr-52">
            <p className="font-bold text-white">Preview</p>
            <div>
              {data["0"].player.type == "image" ? (
                <Image
                  src={data["0"].player.source}
                  width={500}
                  height={500}
                  alt="gif"
                ></Image>
              ) : (
                <video
                  src={data["0"].player.source}
                  autoPlay
                  loop
                  muted
                  style={{ objectFit: "fill" }}
                  className="video-js"
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}

export default Home;
