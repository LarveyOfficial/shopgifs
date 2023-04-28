import { useSession, signIn, signOut } from "next-auth/react";
import useSWR from "swr";

const fetcher = (url: RequestInfo | URL) =>
  fetch(url).then((res) => res.json());

export default function Panel() {
  const { data: session } = useSession();
  const { data, error } = useSWR("/api/getConfig", fetcher, {
    refreshInterval: 1000,
  });
  if (error) return <div>Failed to load config</div>;

  if (!data) return <div>Loading...</div>;

  if (session) {
    if (!data.authorizedUsers.includes(session.user!.email)) signOut();
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight dark:text-white">
            Hello {session.user!.name}!
          </h2>
          <h3 className="text-center dark:text-slate-400">
            {session.user!.email}
          </h3>
          <br />
          <button
            onClick={() => signOut()}
            className="text-dark flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-40 w-auto"
            src="https://www.mtu.edu/mtu_resources/images/download-central/logos/husky-icon/gold.png"
            alt="MTU Logo"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight dark:text-white">
            Sign in to your account
          </h2>
          <br />
          <button
            onClick={() => signIn()}
            className="text-dark flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          >
            Sign in
          </button>
        </div>
      </div>
    </>
  );
}
