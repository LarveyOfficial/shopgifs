import Image from "next/image";
import useSWR from "swr";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";

const fetcher = (url: RequestInfo | URL) =>
  fetch(url).then((res) => res.json());

export default function Gif() {
  const router = useRouter();

  // Check for new image every 1 second
  const { data, error } = useSWR("/api/getConfig", fetcher, {
    refreshInterval: 1000,
  });

  // Take user to panel when keybind detected
  const goToPanel = () => {
    router.push("/panel");
  };

  useKeyboardShortcut(["ctrl", "p"], goToPanel);

  // If data grab fails, show sad face
  if (error)
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

  // While data is loading, show loading animation
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

  return (
    <>
      <Head>
        <title>Player - {process.env.NEXT_PUBLIC_SITENAME}</title>
      </Head>
      <div>
        {data["0"].player.type == "image" ? (
          <Image
            src={data["0"].player.source}
            fill
            style={{ objectFit: "contain" }}
            alt="gif"
          ></Image>
        ) : (
          <video
            src={data["0"].player.source}
            autoPlay
            loop
            muted
            style={{
              aspectRatio: 16 / 9,
              width: "100%",
            }}
          />
        )}
      </div>
      <Analytics />
    </>
  );
}
