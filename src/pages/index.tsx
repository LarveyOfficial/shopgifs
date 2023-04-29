import Image from "next/image";
import useSWR from "swr";
import { Analytics } from "@vercel/analytics/react";

const fetcher = (url: RequestInfo | URL) =>
  fetch(url).then((res) => res.json());

export default function Gif() {
  const { data, error } = useSWR("/api/getConfig", fetcher, {
    refreshInterval: 1000,
  });
  if (error) return <div>Failed to load config</div>;

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <Image
        src={data["0"].player.source}
        fill
        style={{ objectFit: "contain" }}
        alt="gif"
      ></Image>
      <Analytics />
    </>
  );
}
