import { useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { Dialog, Popover } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="bg-gray-700">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <Image
              width={500}
              height={500}
              className="h-9 w-auto"
              src="https://www.mtu.edu/mtu_resources/images/download-central/logos/husky-icon/gold.png"
              alt=""
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-24">
          <Link
            href="/panel/home"
            className="text-sm font-semibold leading-6 text-white hover:text-yellow-500"
          >
            Home
          </Link>
          <Link
            href="/panel/users"
            className="text-sm font-semibold leading-6 text-white hover:text-yellow-500"
          >
            Users
          </Link>
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a
            href="#"
            className="text-sm font-semibold leading-6 text-white hover:text-yellow-500"
            onClick={() =>
              signOut({ callbackUrl: `${window.location.origin}/panel` })
            }
          >
            <span aria-hidden="true">&larr;</span> Sign out
          </a>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-700 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-yellow-500/50">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Shop Gifs</span>
              <Image
                width={500}
                height={500}
                className="h-9 w-auto"
                src="https://www.mtu.edu/mtu_resources/images/download-central/logos/husky-icon/gold.png"
                alt=""
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-yellow-500/50">
              <div className="space-y-2 py-6">
                <Link
                  href="/panel/home"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-600 hover:text-yellow-500"
                >
                  Home
                </Link>
                <Link
                  href="/panel/users"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-600 hover:text-yellow-500"
                >
                  Users
                </Link>
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-600 hover:text-yellow-500"
                  onClick={() =>
                    signOut({ callbackUrl: `${window.location.origin}/panel` })
                  }
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}

export default Header;
