import { SignInPage } from "./components/SignIn/SignInPage";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";

export default function Panel() {
  const title = "Panel - " + process.env.NEXT_PUBLIC_SITENAME;
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
