import { SignInPage } from "./components/SignIn/SignInPage";
import { Analytics } from "@vercel/analytics/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";

export default function Panel() {
  const router = useRouter();
  const title = "Panel - " + process.env.NEXT_PUBLIC_SITENAME;

  // Take user to Player when keybind detected
  const goToPlayer = () => {
    router.push("/");
  };

  useKeyboardShortcut(["ctrl", "p"], goToPlayer);
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <SignInPage />
      <Analytics />
    </>
  );
}
