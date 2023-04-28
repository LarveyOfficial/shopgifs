import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";

export default function Panel() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight dark:text-white">
          Hello {session.user!.name}!
        </h2>
        <button
          onClick={() => signOut()}
          className="text-dark flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
        >
          Sign out
        </button>
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
