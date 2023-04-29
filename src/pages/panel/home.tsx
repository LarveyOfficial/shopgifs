import { Header } from "./Header";
import { useSession, signOut } from "next-auth/react";

export function Home() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <Header />
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight dark:text-white">
              Hello {session.user!.name}!
            </h2>
            <h3 className="text-center dark:text-slate-400">
              {session.user!.email}
            </h3>
            <br />
          </div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}

export default Home;
