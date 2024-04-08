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
  const { data } = useSWR("/api/getConfig", fetcher, {
    refreshInterval: 1000,
    keepPreviousData: true,
  });

  // Take user to panel when keybind detected
  const goToPanel = () => {
    router.push("/panel");
  };

  useKeyboardShortcut(["ctrl", "p"], goToPanel);

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
