import Image from "next/image";
import useSWR from "swr";

const fetcher = (url: RequestInfo | URL) =>
  fetch(url).then((res) => res.json());

export default function Gif() {
  const { data, error } = useSWR("/api/getImageSource", fetcher);
  if (error) return <div>Failed to load</div>;

  if (!data) return <div>Loading...</div>;
  const json = JSON.parse(data);

  return (
    <>
      <Image
        src={json.player.source}
        fill
        style={{ objectFit: "contain" }}
        alt="gif"
      ></Image>
    </>
  );
}
