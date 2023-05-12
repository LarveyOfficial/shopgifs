import { useSession } from "next-auth/react";
import { Header } from "./Header";
import useSWR from "swr";
import Head from "next/head";

const fetcher = (url: RequestInfo | URL) =>
  fetch(url).then((res) => res.json());

function timeConverter(UNIX_timestamp_str: string) {
  const UNIX_timestamp = +UNIX_timestamp_str;
  var a = new Date(UNIX_timestamp);
  var year = a.getFullYear();
  var month = ("0" + (a.getMonth() + 1)).slice(-2);
  var date = ("0" + a.getDate()).slice(-2);
  var hour = ("0" + a.getHours()).slice(-2);
  var min = ("0" + a.getMinutes()).slice(-2);
  var sec = ("0" + a.getSeconds()).slice(-2);
  var time =
    year + "-" + month + "-" + date + " " + hour + ":" + min + ":" + sec;
  return time;
}

export function Logs() {
  const { data: session } = useSession();
  const { data, error } = useSWR("/api/getLogs", fetcher, {
    refreshInterval: 1000,
  });

  // If data errors show sad face
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

  // While data loading, show animation
  if (!data) {
    return (
      <div className="min-w-screen flex min-h-screen items-center justify-center bg-gray-800 p-5">
        <div className="flex animate-pulse space-x-2">
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <>
        <Head>
          <title>Logs - {process.env.NEXT_PUBLIC_SITENAME}</title>
        </Head>
        <Header />
        <div className="hidden justify-center py-5 md:hidden lg:flex">
          <div className="md:flex-1"></div>
          <div className="md:flex-grow">
            <div className="overflow-auto rounded-lg shadow">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="w-12 p-3 text-center text-sm font-semibold tracking-wide text-white">
                      Name
                    </th>
                    <th className="w-12 p-3 text-center text-sm font-semibold tracking-wide text-white">
                      Type
                    </th>
                    <th className="w-12 p-3 text-center text-sm font-semibold tracking-wide text-white">
                      URL
                    </th>
                    <th className="w-12 p-3 text-center text-sm font-semibold tracking-wide text-white">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {data.map((log: any) => {
                    return (
                      <tr key={log._id} className="bg-gray-700 ">
                        <td className="p-3 text-center text-sm text-white">
                          {log.name}
                        </td>
                        <td className="p-3 text-center text-sm text-white">
                          {log.type}
                        </td>
                        <td className="p-3 text-center text-sm text-white">
                          {log.url}
                        </td>
                        <td className="p-3 text-center text-sm text-white">
                          {timeConverter(log.date)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="md:flex-1"></div>
        </div>
        <br />
        <div className="grid grid-cols-1 gap-4 px-5 sm:grid-cols-2 lg:hidden">
          {data.map((log: any) => {
            return (
              <div
                key={log._id}
                className="space-y-2 rounded-lg bg-gray-900 p-4 shadow"
              >
                <div className="flex items-center space-x-2 text-lg text-white">
                  <div>{log.name}</div>
                </div>
                <div className="text-md break-all text-gray-200">{log.url}</div>
                <div className="text-sm text-blue-400">{log.type}</div>
                <div className="text-sm text-slate-500">
                  {timeConverter(log.date)}
                </div>
              </div>
            );
          })}
        </div>
        <br></br>
      </>
    );
  } else {
    return <></>;
  }
}

export default Logs;
