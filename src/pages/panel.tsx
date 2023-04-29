import { SignInPage } from "./components/SignIn/SignInPage";
import { Analytics } from "@vercel/analytics/react";

export default function Panel() {
  return (
    <>
      <SignInPage />
      <Analytics />
    </>
  );
}
