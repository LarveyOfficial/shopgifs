import Image from "next/image";
import { signIn } from "next-auth/react";
export function SignInPage() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto h-40 w-auto"
            width={500}
            height={500}
            src="https://www.mtu.edu/mtu_resources/images/download-central/logos/husky-icon/gold.png"
            alt="MTU Logo"
          ></Image>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight dark:text-white">
            Sign in to access the Panel
          </h2>
          <br />
          <button
            onClick={() => signIn("google")}
            className="text-dark flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          >
            <svg
              className="my-1 -ml-1 mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default SignInPage;
